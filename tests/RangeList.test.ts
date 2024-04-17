import {IntensityManager} from "../src/RangeList";


describe('IntensityManager', () => {
    let manager: IntensityManager;

    beforeEach(() => {
        manager = new IntensityManager();
    });

    test('Start: [], Call: add(10, 30, 1) => [[10,1],[30,0]]', () => {
        manager.update(10, 30, 1, 'add');
        expect(manager.intensities).toEqual([[10, 1], [30, 0]]);
    });

    test('Start: [[10,1],[30,0]], Call: add(20, 40, 1) => [[10,1],[20,2],[30,1],[40,0]]', () => {
        manager.update(10, 30, 1, 'add');
        manager.update(20, 40, 1, 'add');
        expect(manager.intensities).toEqual([[10, 1], [20, 2], [30, 1], [40, 0]]);
    });

    test('Start: [[10,1],[20,2],[30,1],[40,0]], Call: add(10, 40, -2) => [[10,-1],[20,0],[30,-1],[40,0]]', () => {
        manager.update(10, 30, 1, 'add');
        manager.update(20, 40, 1, 'add');
        manager.update(10, 40, -2, 'add');
        expect(manager.intensities).toEqual([[10, -1], [20, 0], [30, -1], [40, 0]]);
    });

    test('Start: [], Sequential operations to mimic multiple updates and final state', () => {
        manager.update(10, 30, 1, 'add');
        expect(manager.intensities).toEqual([[10, 1], [30, 0]]);

        manager.update(20, 40, 1, 'add');
        expect(manager.intensities).toEqual([[10, 1], [20, 2], [30, 1], [40, 0]]);

        manager.update(10, 40, -1, 'add');
        expect(manager.intensities).toEqual([[20, 1], [30, 0]]);

        manager.update(10, 40, -1, 'add');
        expect(manager.intensities).toEqual([[10, -1], [20, 0], [30, -1], [40, 0]]);
    });

    afterEach(() => {
        manager.clear();
    });
});
