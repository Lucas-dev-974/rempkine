import { GenderEnum } from "./PDFTool";
import { ContractEntity } from "../../models/contract.entity";

/**
 * Configuration centralisée des mappings entre les IDs des champs PDF
 * et les propriétés de ContractEntity
 */

export type FieldMapping = {
    contractField: keyof ContractEntity;
    pdfIds: {
        male?: string[];
        female?: string[];
        default?: string;
    };
};

export const PDF_FIELD_MAPPING: Record<string, FieldMapping> = {
    // Contract Information Fields
    startDate: {
        contractField: "startDate",
        pdfIds: { default: "122R" }
    },
    endDate: {
        contractField: "endDate",
        pdfIds: { default: "123R" }
    },
    percentReturnToSubstitute: {
        contractField: "percentReturnToSubstitute",
        pdfIds: { default: "130R" }
    },
    percentReturnToSubstituteBeforeDate: {
        contractField: "percentReturnToSubstituteBeforeDate",
        pdfIds: { default: "131R" }
    },
    nonInstallationRadius: {
        contractField: "nonInstallationRadius",
        pdfIds: { default: "134R" }
    },
    conciliationCDOMK: {
        contractField: "conciliationCDOMK",
        pdfIds: { default: "137R" }
    },
    doneAtLocation: {
        contractField: "doneAtLocation",
        pdfIds: { default: "139R" }
    },
    doneAtDate: {
        contractField: "doneAtDate",
        pdfIds: { default: "138R" }
    },

    // Replaced Fields
    replacedEmail: {
        contractField: "replacedEmail",
        pdfIds: { default: "100R" }
    },
    replacedName: {
        contractField: "replacedName",
        pdfIds: {
            male: ["94R", "117R", "125R", "119R", "121R"],
            female: ["98R", "116R", "114R", "124R", "120R"]
        }
    },
    replacedBirthday: {
        contractField: "replacedBirthday",
        pdfIds: { default: "96R" }
    },
    replacedBirthdayLocation: {
        contractField: "replacedBirthdayLocation",
        pdfIds: { default: "95R" }
    },
    replacedOrderDepartement: {
        contractField: "replacedOrderDepartement",
        pdfIds: { default: "93R" }
    },
    replacedOrderDepartmentNumber: {
        contractField: "replacedOrderDepartmentNumber",
        pdfIds: { default: "97R" }
    },
    replacedProfessionnalAddress: {
        contractField: "replacedProfessionnalAddress",
        pdfIds: { default: "104R" }
    },

    // Substitute Fields
    substituteEmail: {
        contractField: "substituteEmail",
        pdfIds: { default: "111R" }
    },
    substituteName: {
        contractField: "substituteName",
        pdfIds: {
            male: ["99R", "118R", "127R"],
            female: ["105R", "115R", "126R"]
        }
    },
    substituteBirthday: {
        contractField: "substituteBirthday",
        pdfIds: { default: "102R" }
    },
    substituteBirthdayLocation: {
        contractField: "substituteBirthdayLocation",
        pdfIds: { default: "103R" }
    },
    substituteOrderDepartement: {
        contractField: "substituteOrderDepartement",
        pdfIds: { default: "109R" }
    },
    substituteOrderDepartmentNumber: {
        contractField: "substituteOrderDepartmentNumber",
        pdfIds: { default: "108R" }
    },
    substituteAdress: {
        contractField: "substituteAdress",
        pdfIds: { default: "112R" }
    }
};

/**
 * Obtient les IDs PDF pour un champ donné selon le genre
 */
export function getPDFIdsForField(fieldName: string, gender?: GenderEnum): string | string[] {
    const mapping = PDF_FIELD_MAPPING[fieldName];
    if (!mapping) return [];

    if (mapping.pdfIds.default) {
        return mapping.pdfIds.default;
    }

    if (gender && mapping.pdfIds[gender]) {
        return mapping.pdfIds[gender]!;
    }

    // Si pas de genre spécifié, retourner tous les IDs possibles
    const allIds: string[] = [];
    if (mapping.pdfIds.male) allIds.push(...mapping.pdfIds.male);
    if (mapping.pdfIds.female) allIds.push(...mapping.pdfIds.female);
    return allIds;
}

/**
 * Obtient le nom du champ ContractEntity à partir d'un ID PDF
 */
export function getContractFieldFromPDFId(pdfId: string): keyof ContractEntity | undefined {
    for (const [fieldName, mapping] of Object.entries(PDF_FIELD_MAPPING)) {
        const ids = mapping.pdfIds;

        if (ids.default === pdfId) {
            return mapping.contractField;
        }

        if (ids.male?.includes(pdfId) || ids.female?.includes(pdfId)) {
            return mapping.contractField;
        }
    }
    return undefined;
}

/**
 * Obtient tous les IDs PDF pour un champ ContractEntity donné
 */
export function getPDFIdsForContractField(
    contractField: keyof ContractEntity,
    gender?: GenderEnum
): string[] {
    // Trouver le fieldName correspondant au contractField
    for (const [fieldName, mapping] of Object.entries(PDF_FIELD_MAPPING)) {
        if (mapping.contractField === contractField) {
            const ids = getPDFIdsForField(fieldName, gender);
            return Array.isArray(ids) ? ids : [ids];
        }
    }
    return [];
}

