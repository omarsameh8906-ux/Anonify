
import { z } from "zod";
import { generalValidationFields } from "../../common/general.validation.js";

export const updateProfile = (language) => {
    return z.object({
        body: z.strictObject({
            firstName: z.string().min(2).max(25).optional(),
            lastName: z.string().min(2).max(25).optional(),
            phone: generalValidationFields.phone(language).optional(),
            DOB: z.coerce.date().optional(),
            gender: generalValidationFields.gender(language).optional()
        }).refine(
            (data) => Object.keys(data).length > 0,
            { message: "At least one field is required" }
        )
    });
};
