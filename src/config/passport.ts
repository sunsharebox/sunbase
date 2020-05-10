/*
 * passport.ts
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

import { Request } from 'express';
import sanitize from 'mongo-sanitize';
import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import FlashMessages from '../utils/flash-messages';
import User, { UserDocument } from '../models/User';
import logger from '../utils/logger';

export default (passport: PassportStatic) => {
	passport.serializeUser((user: UserDocument, done: Function) => {
		done(null, user._id);
	});

	passport.deserializeUser((id: number, done: Function) => {
		User.findById(id, done);
	});

	passport.use(new LocalStrategy({ passReqToCallback: true },
		(req: Request, username: string, password: string, done: Function) => {
			username = sanitize(username);
			
			const criteria = (username.indexOf('@') === -1)
				? { username: username }
				: { email: username };
    
			User.findOne(criteria, (err, user: UserDocument) => {
				if (err) {
					logger.error(`Login error: ${err}`);
					req.flashLocalized('error', FlashMessages.INTERNAL_ERROR);
					return done(null, false);
				}
				if (!user || (user && !user.comparePassword(password))) {
					req.flashLocalized('error', FlashMessages.INVALID_CREDENTIALS);
					return done(null, false);
				}

				return done(null, user);
			});
		}
	));
};
