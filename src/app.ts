/*
 * app.ts
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

import dotenv from 'dotenv-safe';
import express from 'express';
import path from 'path';

// Load .env
dotenv.config();

// Load DBs
import './db/mongodb';
import './db/influxdb';

// Create Express server
const app = express();

// Express configuration
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine({
	beautify: process.env.NODE_ENV !== 'production'
}));

app.disable('strict routing');

if (app.get('env') === 'production') {
	app.set('trust proxy', 1);
}

app.use(express.static(path.join(__dirname, 'public')));

import R from './controllers';
app.use(R);

export default app;
