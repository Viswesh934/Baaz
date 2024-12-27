const orders = require('../models/orders');
const materials = require('../models/materials');
const { createOrder, updateOrder, getOrders, deleteOrder } = require('../controllers/orderController');
const logger = require('../logger/logger');

jest.mock('../models/orders');
jest.mock('../models/materials');
jest.mock('../logger/logger');

describe('Order Controllers', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {
            body: {
                customerName: 'Test Customer',
                items: [{ materialId: '123', quantity: 10 }]
            },
            params: { id: '456' }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        test('should create order successfully', async () => {
            const mockMaterial = {
                basePrice: 100,
                stock: 20,
                save: jest.fn()
            };
            materials.findById.mockResolvedValue(mockMaterial);
            orders.mockImplementation(() => ({
                save: jest.fn()
            }));

            await createOrder(mockReq, mockRes);

            expect(materials.findById).toHaveBeenCalledWith('123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockMaterial.save).toHaveBeenCalled();
        });

        test('should handle insufficient stock', async () => {
            materials.findById.mockResolvedValue({ stock: 5, basePrice: 100 });

            await createOrder(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith('Quantity not available');
        });

        test('should apply correct discount', async () => {
            const mockMaterial = {
                basePrice: 100,
                stock: 200,
                save: jest.fn()
            };
            mockReq.body.items[0].quantity = 101;
            materials.findById.mockResolvedValue(mockMaterial);
            orders.mockImplementation(() => ({
                save: jest.fn()
            }));

            await createOrder(mockReq, mockRes);

            expect(logger.info).toHaveBeenCalledWith('10% discount applied');
        });
    });

    describe('updateOrder', () => {
        test('should update order status successfully', async () => {
            mockReq.body.status = 'Completed';
            const mockOrder = { id: '456', status: 'Completed' };
            orders.findByIdAndUpdate.mockResolvedValue(mockOrder);

            await updateOrder(mockReq, mockRes);

            expect(orders.findByIdAndUpdate).toHaveBeenCalledWith('456', { status: 'Completed' }, { new: true });
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        test('should reject invalid status', async () => {
            mockReq.body.status = 'Invalid';
            
            await updateOrder(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith('Invalid status');
        });
    });

    describe('getOrders', () => {
        test('should fetch orders successfully', async () => {
            const mockOrders = [{ id: '1' }, { id: '2' }];
            orders.find.mockResolvedValue(mockOrders);

            await getOrders(mockReq, mockRes);

            expect(orders.find).toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledWith(mockOrders);
        });
    });

    describe('deleteOrder', () => {
        test('should delete order and update stock successfully', async () => {
            const mockOrder = {
                items: [{ materialId: '123', quantity: 5 }]
            };
            const mockMaterial = {
                stock: 15,
                save: jest.fn()
            };
            
            orders.findById.mockResolvedValue(mockOrder);
            orders.findByIdAndDelete.mockResolvedValue(mockOrder);
            materials.findById.mockResolvedValue(mockMaterial);

            await deleteOrder(mockReq, mockRes);

            expect(mockMaterial.stock).toBe(20);
            expect(mockMaterial.save).toHaveBeenCalled();
            expect(mockRes.send).toHaveBeenCalledWith(mockOrder);
        });

        test('should handle non-existent order', async () => {
            orders.findById.mockResolvedValue(null);

            await deleteOrder(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.send).toHaveBeenCalledWith('Order not found');
        });
    });
});