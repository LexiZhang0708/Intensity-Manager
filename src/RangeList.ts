class IntensityManager {
    intensities: [number, number][];

    constructor() {
        this.intensities = [];
    }

    private validateRange(from: number, to: number): boolean {
        if (to < from) {
            console.error("Invalid range: end time must be greater than start time.");
            return false;
        }
        return true;
    }

    private findIndex(time: number): number {
        /*
        Return the index of the time in the intensity array if it's already present, otherwise return -1.
         */
        const times = this.intensities.map(segment => segment[0]);
        return times.indexOf(time);
    }

    private insertNewTime(time: number): number {
        /*
        Insert the new time and its corresponding intensity into the intensity array.
         */
        let idx = this.findIndex(time);
        if (idx === -1) {
            let startTime = this.intensities[0][0];
            let endTime = this.intensities[this.intensities.length-1][0];
            if (time < startTime) {
                this.intensities.unshift([time, 0]);
                idx = 0;
            }
            else if (time > endTime) {
                this.intensities.push([time, 0]);
                idx = this.intensities.length - 1
            }
            else {
                idx = this.findInsertionIndex(time);
                this.intensities.splice(idx, 0, [time, this.intensities[idx - 1][1]]);
            }
        }
        return idx;
    }

    private findInsertionIndex(time: number): number {
        for (let i = 0; i < this.intensities.length; i++) {
            if (time < this.intensities[i][0]) {
                return i;
            }
        }
        return this.intensities.length;
    }

    private updateIntensities(startIdx: number, endIdx: number, amount: number) {
        for (let i = startIdx; i <= endIdx; i++) {
            this.intensities[i][1] += amount;
        }
    }

    add(from: number, to: number, amount: number) {
        if (!this.validateRange(from, to)) {
            return;
        }

        if (from === to || amount === 0) {
            return this.intensities;
        }

        if (this.intensities.length === 0) {
            this.intensities = [[from, amount], [to, 0]];
        } else {
            let updateStartIdx = this.insertNewTime(from);
            let updateEndIdx = this.insertNewTime(to);
            this.updateIntensities(updateStartIdx, updateEndIdx, amount);
        }
        return this.intensities;
    }

    set(from: number, to: number, amount: number) {

    }
}

module.exports = IntensityManager;