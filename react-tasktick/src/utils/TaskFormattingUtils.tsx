export const processDateValue = (dateValue: any): string | null => {
    if (!dateValue || dateValue === "Not set") return null;

    try {
        const date =
            typeof dateValue === "string" ? new Date(dateValue) : dateValue;

        if (isNaN(date.getTime())) return null;

        const currentYear = new Date().getFullYear();
        if (date.getFullYear() < 2020) {
            date.setFullYear(currentYear);
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    } catch (error) {
        return null;
    }
};

export const formatDateForDisplay = (dateValue: any): string => {
    if (!dateValue || dateValue === "Not set") return "Not set";

    try {
        const date =
            typeof dateValue === "string" ? new Date(dateValue) : dateValue;
        if (isNaN(date.getTime())) return String(dateValue);

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch (error) {
        return String(dateValue);
    }
};

export const processEstimatedTime = (
    value: any,
    originalValue: number | undefined = undefined
): number => {
    if (typeof value === "number" && !isNaN(value)) {
        return value;
    }

    if (typeof value === "string") {
        const numStr = value.replace(/[^\d.]/g, "");
        const numericValue = parseFloat(numStr);

        if (!isNaN(numericValue)) {
            return numericValue;
        }
    }

    if (originalValue !== undefined) {
        return originalValue;
    }

    return 0;
};

export const getEstimatedTimeDisplay = (hours: number): string => {
    return `${hours} hrs`;
};
