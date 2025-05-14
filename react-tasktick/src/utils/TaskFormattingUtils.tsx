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



