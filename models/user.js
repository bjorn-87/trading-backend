// const db = require('../db/database.js');
// const jwt = require('jsonwebtoken');
//
// let config;
//
// try {
//     config = require("../config.json");
// } catch (error) {
//     console.error(error);
// }
//
// const secret = process.env.JWT_SECRET || config.secret;
//
//
// /**
//  * Function to get all reports.
//  */
// var getAllReports = function(res) {
//     db.all("SELECT * FROM reports", (err, row) => {
//         if (err) {
//             return res.status(500).json({
//                 errors: {
//                     status: 500,
//                     source: "/register",
//                     title: "Database error",
//                     detail: err.message
//                 }
//             });
//         }
//
//         res.status(200).json( { data: row } );
//     });
// };
//
// /**
//  * Function to get one report.
//  */
// var getReport = function(res, week) {
//     let sql = `SELECT * FROM reports WHERE week = ${week}`;
//
//     db.get(
//         sql,
//         (err, row) => {
//             if (err) {
//                 return res.status(500).json({
//                     errors: {
//                         status: 500,
//                         source: "/register",
//                         title: "Database error",
//                         detail: err.message
//                     }
//                 });
//             } else if (row === undefined) {
//                 return res.status(404).json({
//                     data: {
//                         status: 404,
//                         text: "404 Page not found"
//                     }
//                 });
//             }
//             // console.log(row);
//             res.status(200).json( { data: row } );
//         });
// };
//
// /**
//  * Function to check if jwt token is valid
//  */
// var checkToken = function(req, res, next) {
//     const token = req.headers['x-access-token'];
//
//     jwt.verify(token, secret, function(err) {
//         if (err) {
//             return res.status(500).json({
//                 errors: {
//                     status: 500,
//                     source: "/register",
//                     title: "Authentication failed",
//                     detail: err.message
//                 }
//             });
//         }
//         // console.log(token);
//         next();
//     });
// };
//
// /**
//  * Function to edit a report.
//  */
// var editReport = function(res, body) {
//     const week = parseInt(body.week);
//     const text = body.text;
//
//     // console.log(week);
//     // console.log(text);
//     db.run("UPDATE reports SET text = ? WHERE week = ?",
//         text,
//         week, (err) => {
//             if (err) {
//                 return res.status(500).json({
//                     error: {
//                         status: 500,
//                         source: "/register/edit",
//                         title: "Databas error",
//                         detail: err.message
//                     }
//                 });
//             }
//             return res.status(200).json({
//                 data: {
//                     msg: "Report successfully updated"
//                 }
//             });
//         });
// };
//
// /**
//  * Function to add a report.
//  */
// var addReport = function(res, body) {
//     const week = parseInt(body.week);
//     const text = body.text;
//
//     db.run("INSERT INTO reports (week, text) VALUES (?, ?)",
//         week,
//         text, (err) => {
//             if (err) {
//                 return res.status(500).json({
//                     errors: {
//                         status: 500,
//                         source: "/register/edit",
//                         title: "Databas error",
//                         detail: err.message
//                     }
//                 });
//             }
//             res.status(201).json({
//                 data: {
//                     msg: "report successfully registered"
//                 }
//             });
//         }
//     );
// };
//
// module.exports = {
//     getAllReports: getAllReports,
//     getReport: getReport,
//     checkToken: checkToken,
//     editReport: editReport,
//     addReport: addReport
// };
