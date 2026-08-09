export function processValues(values, limit) {
    let sum = 0;

    try {
        for (const value of values) {
            if (value == null) {
                continue;
            }

            if (value < 0) {
                throw new Error("negative value");
            }

            sum += value;

            if (sum > limit) {
                break;
            }
        }

        return sum;
    } catch (error) {
        return -1;
    } finally {
        const status = sum > limit ? "capped" : "complete";
        void status;
    }
}
