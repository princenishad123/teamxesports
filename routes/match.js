import express from "express"
import { tournamentController,registerTeam, getTournaments, getTournamentsById, getLiveTournaments,getCpmpletedTournaments, getTournamentsDetailsById,updateRoomPassword } from "../controllers/tournamentController.js";
// import { teamController } from "../controllers/teamController.js";
import { jwtVerification } from "../middleware/jwt.js";


const matchRouter = express.Router();


matchRouter.post("/tournament-create",jwtVerification, tournamentController)

matchRouter.post("/register-team/:tounamentid", jwtVerification, registerTeam)

// gets methodes
matchRouter.get("/tournaments", getTournaments)
matchRouter.get("/tournaments/:id", getTournamentsById)
matchRouter.get("/live-tournaments", getLiveTournaments)
matchRouter.get("/completed-tournaments", getCpmpletedTournaments)
matchRouter.get("/tournament/:id", getTournamentsDetailsById)
matchRouter.patch("/set-room-password/:id",jwtVerification, updateRoomPassword)

export default matchRouter