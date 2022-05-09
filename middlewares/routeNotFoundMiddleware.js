import { StatusCodes } from "http-status-codes";

const routeNotFound = (request, response) => {
  response.status(StatusCodes.NOT_FOUND).send("not found");
};

export default routeNotFound;
