const materials = require('../models/materials');
const { stockReport, priceFluctuation } = require('../controllers/reportingController');
const logger = require('../logger/logger');

jest.mock('../models/materials');
jest.mock('../logger/logger');

describe('Report Controllers', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        mockReq = {};
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('stockReport', () => {
        test('should generate stock report successfully', async () => {
            const mockMaterials = [
                { name: 'Material 1', stock: 100 },
                { name: 'Material 2', stock: 200 }
            ];
            materials.find.mockResolvedValue(mockMaterials);

            await stockReport(mockReq, mockRes);

            const expectedReport = mockMaterials.map(m => ({
                name: m.name,
                stock: m.stock
            }));
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith(expectedReport);
            expect(logger.info).toHaveBeenCalledWith('Stock report generated successfully');
        });

        test('should handle errors in stock report generation', async () => {
            const error = new Error('Database error');
            materials.find.mockRejectedValue(error);

            await stockReport(mockReq, mockRes);

            expect(logger.error).toHaveBeenCalledWith('Error in generating stock report');
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalled();
        });
    });

    describe('priceFluctuation', () => {
        test('should calculate price fluctuation successfully', async () => {
            const mockMaterials = [
                { name: 'Material 1', priceHistory: [100, 110] },
                { name: 'Material 2', priceHistory: [200, 210] }
            ];
            materials.find.mockResolvedValue(mockMaterials);

            await priceFluctuation(mockReq, mockRes);

            const expectedReport = mockMaterials.map(m => ({
                priceHistory: m.priceHistory
            }));
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith(expectedReport);
            expect(logger.info).toHaveBeenCalledWith('Price fluctuation calculated successfully');
        });

        test('should handle errors in price fluctuation calculation', async () => {
            const error = new Error('Database error');
            materials.find.mockRejectedValue(error);

            await priceFluctuation(mockReq, mockRes);

            expect(logger.error).toHaveBeenCalledWith('Error in calculating price fluctuation');
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith('Error in calculating price fluctuation');
        });
    });
});