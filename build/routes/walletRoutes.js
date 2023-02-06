"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallets_1 = __importDefault(require("../handlers/wallets"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Wallet:
 *       type: object
 *       required:
 *         - userI
 *         - type
 *         - activatedCoins
 *       properties:
 *         _id:
 *           type: string
 *           description: The autogenerated id of the User
 *         userId:
 *           type: string
 *           description: The ID of the user.
 *         type:
 *           type: string
 *           description: The type of Wallet
 *         privateKey:
 *           type: string
 *           description: The private key of the Wallet
 *         pubKey:
 *           type: string
 *           description: The public key of the Wallet
 *         address:
 *           type: string
 *           description: The Blockchain address of the Wallet
 *         phrase:
 *           type: string
 *           description: The Backup phrase for the Wallet
 *         activatedCoins:
 *           type: array
 *           description: The list of coins activated in the Wallet
 *         createdAt:
 *           type: Date
 *           description: The date the Wallet was created
 */
/**
 * @swagger
 * /wallet:
 *  get:
 *    summary: Returns a list of Wallets
 *    tags:
 *      - Wallet Endpoints
 *    responses:
 *      200:
 *        description: successful
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Wallet'
 *      404:
 *         description: Not found
 *      500:
 *         description: Internal Server Error
 *  post:
 *      summary: Create a new wallet
 *      tags:
 *          - Wallet Endpoints
 *      description: Sends request to the server to create a new wallet
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                 schema:
 *                          type: object
 *                          properties:
 *                              type:
 *                                  type: string
 *                                  example: standard
 *                              activatedCoins:
 *                                  type: array
 *                                  example: []
 *
 *      responses:
 *           201:
 *              description: Success
 *              content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               message:
 *                                   type: string
 *                                   example: success
 *           400:
 *               description: Bad Request
 *           500:
 *               description: Internal server error
 * /wallet/user:
 *      get:
 *          summary: Get user wallets
 *          tags:
 *              - Wallet Endpoints
 *          description: Sends request to the server to get user wallets
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  userWallets:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/Wallet'
 *              404:
 *                  description: Not Found
 *              500:
 *                  description: Internal server error
 * /wallet/trxn%20wallet/{type}:
 *      put:
 *          summary: Create a transaction in wallet
 *          tags:
 *              - Wallet Endpoints
 *          description: Sends request to the server to create a new transaction in wallet
 *          parameters:
 *              - in: path
 *                name: type
 *                schema:
 *                  type: string
 *                required: true
 *                description: type of transaction
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              receiver:
 *                                  type: string
 *                                  example: 0xjejwe1dse23833r3
 *                              sender:
 *                                  type: string
 *                                  example: 0xAw238ef8je3j239smd
 *                              amount:
 *                                  type: number
 *                                  example: 3.3
 *                              coin:
 *                                  type: string
 *                                  example: BTC
 *
 *          responses:
 *              204:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: success
 *              400:
 *                  description: Bad Request
 *              500:
 *                  description: Internal server error
 * /wallet/{id}:
 *      get:
 *          summary: get wallet by given id
 *          tags:
 *              - Wallet Endpoints
 *          description: Sends request to the server to wallet by id
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: type of transaction
 *
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  wallet:
 *                                      type: object
 *                                      example: {}
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 *
 */
(0, wallets_1.default)(router);
exports.default = router;
