const materials = require('../models/materials');
const { getMaterials, postMaterials, updateMaterials, deleteMaterials } = require('../controllers/materialController');
const logger = require('../logger/logger');


jest.mock('../models/materials');
jest.mock('../logger/logger');

describe('Materials Controllers', () => {
    let mockReq;
    let mockRes;
    
    beforeEach(() => {
        mockReq = {
            body: { name: 'Test Material' },
            params: { id: '123' }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMaterials', () => {
        test('should fetch materials successfully', async () => {
            const mockData = [{ name: 'Material 1' }, { name: 'Material 2' }];
            materials.find.mockResolvedValue(mockData);

            await getMaterials(mockReq, mockRes);

            expect(materials.find).toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Materials fetched successfully');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith(mockData);
        });

        test('should handle errors when fetching materials', async () => {
            materials.find.mockRejectedValue(new Error('Database error'));

            await getMaterials(mockReq, mockRes);

            expect(logger.error).toHaveBeenCalledWith('Error in fetching materials');
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith('Error in fetching materials');
        });
    });

    describe('postMaterials', () => {
        test('should add material successfully', async () => {
            const mockSave = jest.fn();
            materials.mockImplementation(() => ({
                save: mockSave
            }));

            await postMaterials(mockReq, mockRes);

            expect(materials).toHaveBeenCalledWith(mockReq.body);
            expect(logger.info).toHaveBeenCalledWith('Material added successfully');
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        test('should handle errors when adding material', async () => {
            materials.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error('Save error'))
            }));

            await postMaterials(mockReq, mockRes);

            expect(logger.error).toHaveBeenCalledWith('Error in adding material');
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateMaterials', () => {
        test('should update material successfully', async () => {
            const mockData = { save: jest.fn() };
            materials.findByIdAndUpdate.mockResolvedValue(mockData);

            await updateMaterials(mockReq, mockRes);

            expect(materials.findByIdAndUpdate).toHaveBeenCalledWith('123', mockReq.body);
            expect(logger.info).toHaveBeenCalledWith('Material updated successfully');
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        test('should handle errors when updating material', async () => {
            materials.findByIdAndUpdate.mockRejectedValue(new Error('Update error'));

            await updateMaterials(mockReq, mockRes);

            expect(logger.error).toHaveBeenCalledWith('Error in updating material');
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deleteMaterials', () => {
        test('should delete material successfully', async () => {
            const mockData = { id: '123' };
            materials.findByIdAndDelete.mockResolvedValue(mockData);

            await deleteMaterials(mockReq, mockRes);

            expect(materials.findByIdAndDelete).toHaveBeenCalledWith('123');
            expect(logger.info).toHaveBeenCalledWith('Material deleted successfully');
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        test('should return 404 when material not found', async () => {
            materials.findByIdAndDelete.mockResolvedValue(null);

            await deleteMaterials(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.send).toHaveBeenCalledWith('Material not found');
        });

        test('should handle errors when deleting material', async () => {
            materials.findByIdAndDelete.mockRejectedValue(new Error('Delete error'));

            await deleteMaterials(mockReq, mockRes);

            expect(logger.error).toHaveBeenCalledWith('Error in deleting material');
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });
});