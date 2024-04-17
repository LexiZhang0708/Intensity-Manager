export class IntensityManager {
    /*
    A class that manages “intensity” by segments.
    */
    intensities: [number, number][];

    constructor() {
        this.intensities = [];
    }


    private validateRange(from: number, to: number): boolean {
        /*
        Validate whether the input interval [from, to] is valid.
         */
        if (typeof from !== 'number' || typeof to !== 'number') {
            // from and to must be numbers
            console.error("Invalid range: 'from' and 'to' must be numbers.");
            return false;
        }
        if (to < from) {
            // end time must be greater than start time
            console.error("Invalid range: 'to' must be greater than 'from'.");
            return false;
        }

        return true;
    }


    private findIndex(time: number): number {
        /*
        Return the index of the time in the intensity array if it's already present, otherwise return -1.

        Example Usage:
        this.intensities = [[10, 1], [13, 1], [50, 0]], time = 13, fineIndex(time) = 1
        this.intensities = [[10, 1], [13, 1], [50, 0]], time = 30, fineIndex(time) = -1
         */
        const times = this.intensities.map(segment => segment[0]);
        return times.indexOf(time);
    }


    private findInsertionIndex(time: number): number {
        /*
        Return the index of insertion for time in the intensity array.
         */
        for (let i = 0; i < this.intensities.length; i++) {
            if (time < this.intensities[i][0]) {
                // insert just before the first encounter of a greater value
                return i;
            }
        }
        return this.intensities.length;
    }


    private insertNewTime(time: number): number {
        /*
        Insert the new time and its corresponding intensity into the intensity array.
         */

        // find the index of time in the intensity array if it already exists
        let idx = this.findIndex(time);
        if (idx === -1) {
            // if time doesn't yet exist in the intensity array, find the correct index to insert the new time into the
            // array at
            let startTime = this.intensities[0][0];
            let endTime = this.intensities[this.intensities.length-1][0];
            if (time < startTime) {
                // if new time is smaller than the current start time, insert at the beginning of array
                // the new intensity would be 0
                this.intensities.unshift([time, 0]);
                idx = 0;
            } else if (time > endTime) {
                // if new time is greater than the current end time, insert at the end of array
                // the new intensity would be 0
                this.intensities.push([time, 0]);
                idx = this.intensities.length - 1;
            } else {
                // if new time is within the current range of time, find the correct index to insert it at
                idx = this.findInsertionIndex(time);
                // the new intensity would be the same as the intensity of the previous time
                this.intensities.splice(idx, 0, [time, this.intensities[idx - 1][1]]);
            }
        }
        return idx;
    }


    private updateIntensities(startIdx: number, endIdx: number, amount: number) {
        /*
        Update the intensity values for times in this.intensities[startIdx, endIdx] by amount.
         */

        for (let i = startIdx; i <= endIdx; i++) {
            this.intensities[i][1] += amount;
        }
        this.intensities[this.intensities.length - 1][1] = 0;
    }


    private setIntensities(startIdx: number, endIdx: number, amount: number) {
        /*
        Set the intensity values for times in this.intensities[startIdx, endIdx] to amount.
         */
        this.intensities[startIdx][1] = amount;
        this.intensities[endIdx][1] = amount;
        // remove everything in between the endpoints as they all have the same intensity
        this.intensities.splice(startIdx + 1, endIdx - startIdx - 1);
    }


    private trimLeadingZeros() {
        /*
        Trim the leading zeros in an intensity array since an intensity sequence starts with a non-zero intensity value.
         */
        while (this.intensities.length > 0 && this.intensities[0][1] === 0) {
            this.intensities.shift();
        }
    }


    private trimTrailingZeros() {
        /*
        Trim the trailing zeros in an intensity array since an intensity sequence ends with one 0 intensity value only.
         */
        for (let i = this.intensities.length - 1; i > 0; i--) {
            if (this.intensities[i][1] === 0 && this.intensities[i-1][1] === 0) {
                // remove the last timestamp if the second last timestamp has a 0 intensity also
                this.intensities.pop();
            }
            else {
                break;
            }
        }
    }


    private trimZeros() {
        /*
        Trim the leading and trailing zeros for an intensity array.
         */
        this.trimLeadingZeros();
        this.trimTrailingZeros();
    }


    private removeDuplicates() {
        /*
        Remove times in the intensity array with duplicate intensities.
         */
        for (let i = this.intensities.length - 1; i > 0; i--) {
            // compare the intensity of the current time with the previous one
            if (this.intensities[i][1] === this.intensities[i - 1][1]) {
                // if duplicate is found remove the current element
                this.intensities.splice(i, 1);
            }
        }
    }


    update(from: number, to: number, amount: number, mode: "add" | "set") {
        /*
        Update the intensity array at the time interval [from, to] by amount if mode is "add" and set it to amount
        if mode is "set.
         */

        // validate the new time range
        if (!this.validateRange(from, to)) {
            return;
        }

        // set the algorithm according to mode
        let func: (startIdx: number, endIdx: number, amount: number) => void;

        switch(mode) {
            case "add":
                if (from === to || amount === 0) {
                    // nothing to update
                    return this.intensities;
                }
                func = this.updateIntensities.bind(this);
                break;
            case "set":
                if (from === to) {
                    // nothing to set
                    return this.intensities;
                }
                func = this.setIntensities.bind(this);
                break;
            default:
                console.error("Invalid mode: must be 'add' or 'set'");
                return;
        }

        if (this.intensities.length === 0) {
            this.intensities = [[from, amount], [to, 0]];
        } else {
            // update the intensities in this.intensities[updateStartIdx, updateEndIdx] by amount if array is non-empty
            let updateStartIdx = this.insertNewTime(from);
            let updateEndIdx = this.insertNewTime(to);
            func(updateStartIdx, updateEndIdx, amount);
        }

        // trim the leading and trailing zeros
        this.trimZeros();
        // remove duplicate intensities
        this.removeDuplicates();
        return this.intensities;
    }


    clear() {
        /*
        Clear the intensity array.
         */
        this.intensities = [];
    }
}

