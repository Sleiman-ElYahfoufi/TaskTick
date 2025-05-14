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
        console.error("Date processing error:", error);
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
    // If value is already a number, return it directly
    if (typeof value === "number" && !isNaN(value)) {
        return value;
    }

    // Handle the case where value is a string
    if (typeof value === "string") {
        // Remove any non-numeric characters except for decimal point
        // This will handle strings like "5 hrs", "5hrs", etc.
        const numStr = value.replace(/[^\d.]/g, "");
        const numericValue = parseFloat(numStr);

        if (!isNaN(numericValue)) {
            return numericValue;
        }
    }

    // If we couldn't extract a valid number and have an original value, use that
    if (originalValue !== undefined) {
        return originalValue;
    }

    // Default to 0 if all else fails
    return 0;
};

export const getEstimatedTimeDisplay = (hours: number): string => {
    return `${hours} hrs`;
};
