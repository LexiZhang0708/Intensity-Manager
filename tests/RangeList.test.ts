import {IntensityManager} from "../src/RangeList";


describe('IntensityManager Operations', () => {
    let manager: IntensityManager;

    beforeEach(() => {
        manager = new IntensityManager();
    });

    describe('add operation', () => {
        test('Start: [], Call: update(10, 30, 1, \'add\') => [[10,1],[30,0]]', () => {
            manager.update(10, 30, 1, 'add');
            expect(manager.intensities).toEqual([[10, 1], [30, 0]]);
        });

        test('Start: [[10,1],[30,0]], update(20, 40, 1, \'add\') => [[10,1],[20,2],[30,1],[40,0]]', () => {
            manager.update(10, 30, 1, 'add');
            manager.update(20, 40, 1, 'add');
            expect(manager.intensities).toEqual([[10, 1], [20, 2], [30, 1], [40, 0]]);
        });

        test('Start: [[10,1],[20,2],[30,1],[40,0]], Call: update(10, 40, -2, \'add\') => [[10,-1],[20,0],[30,-1],[40,0]]', () => {
            manager.update(10, 30, 1, 'add');
            manager.update(20, 40, 1, 'add');
            manager.update(10, 40, -2, 'add');
            expect(manager.intensities).toEqual([[10, -1], [20, 0], [30, -1], [40, 0]]);
        });

        test('Start: [[10,1],[20,2],[30,1],[40,0]], Call: update(10, 40, -1, \'add\') => [[20,1],[30,0]', () => {
            manager.update(10, 30, 1, 'add');
            manager.update(20, 40, 1, 'add');
            manager.update(10, 40, -1, 'add');
            expect(manager.intensities).toEqual([[20, 1], [30, 0]]);
        });

        test('Start: [[20, 1], [30, 0]], Call: update(10, 40, -1, \'add\') => [[10,-1],[20,0],[30,-1],[40,0]]', () => {
            manager.update(10, 30, 1, 'add');
            manager.update(20, 40, 1, 'add');
            manager.update(10, 40, -1, 'add');
            manager.update(10, 40, -1, 'add');
            expect(manager.intensities).toEqual([[10, -1], [20, 0], [30, -1], [40, 0]]);
        });

        test('should remove consecutive duplicates', () => {
            manager.update(10, 30, 1, 'add');
            manager.update(20, 30, 1, 'add');
            manager.update(20, 30, -1, 'add');
            manager.update(40, 50, 0, 'add');
            expect(manager.intensities).toEqual([[10, 1], [30, 0]]);
        });

        test('should handle no operation correctly', () => {
            manager.update(10, 10, 0, 'add');
            expect(manager.intensities).toEqual([]);
        });

        test('should trim leading and trailing zeros', () => {
            manager.update(10, 20, 0, 'add');
            manager.update(30, 40, 1, 'add');
            manager.update(50, 60, 0, 'add');
            manager.update(60, 70, 0, 'add');
            expect(manager.intensities).toEqual([[30, 1], [40, 0]]);
        });
    });

    describe('set operation', () => {

    });

    afterEach(() => {
        manager.clear();
    });
});
