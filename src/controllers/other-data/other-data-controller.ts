/*
 * other-data-controller.ts
 * Copyright (C) Sunshare 2019
 *
 * This file is part of Sunbase.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { NextFunction, Response, Request } from 'express';
import sanitize from 'mongo-sanitize';

import * as InfluxHelper from '../../utils/influx-helper';
import User from '../../models/User';

export async function renderOtherDataPage(req: Request, res: Response, _: NextFunction) {
	const granter = await User.Model.findOne({ username: sanitize(req.query.showUser) });

	if (!granter || !req.user!.hasPermissionFrom(granter.id, 'read' as any)) {
		req.flash('error', 'No read access');
		return res.redirect('/');
	}

	const userResults = await InfluxHelper.query(
		`SELECT
		SUM(production) AS production,
		SUM(consumption) AS consumption,
		SUM(surplus) AS surplus
		FROM "EnergyRecord"
		WHERE created_by = '${granter.id}' AND time >= now() - 1d AND time <= now()
		GROUP BY time(15m) fill(none)`
	);

	res.render("other-data", {
		userData: {
			time: userResults.rows.map((r: any) => r.time.toNanoISOString()),
			production: userResults.rows.map((r: any) => r.production),
			consumption: userResults.rows.map((r: any) => r.consumption),
			surplus: userResults.rows.map((r: any) => r.surplus),
		},
		user: granter,
	});
}
