import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";

export default function errorHandler(error, res) {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") return res.status(400).json({
            error: `${error?.meta?.target} must be unique!`
        })
    }
    else if (error instanceof PrismaClientValidationError) {
        console.log(error.message, error.name);

    }

    console.log(error);
    return res.status(500).json({ error: "Internal server error "});
}