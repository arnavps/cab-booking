import { PrismaClient } from '@prisma/client';
import { Socket } from 'socket.io-client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';

const prisma = new PrismaClient();

describe('Booking Flow Integration', () => {
    let io: Server, serverSocket: any, clientSocket: any;
    const port = 4000;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(port, () => {
            clientSocket = Client(`http://localhost:${port}`);
            io.on('connection', (socket) => {
                serverSocket = socket;
            });
            clientSocket.on('connect', done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.disconnect();
    });

    test('should handle ride request and driver acceptance', (done) => {
        const mockRide = {
            id: 'test-ride-123',
            passengerId: 'user-1',
            pickup: '123 Main St',
            dropoff: '456 Tech Ave',
            fare: 25.50
        };

        // 1. Rider emits request
        clientSocket.emit('request-ride', mockRide);

        // 2. Server (mocked as broadcast) should emit it to all
        clientSocket.on('new-ride-request', (data: any) => {
            expect(data.id).toBe(mockRide.id);

            // 3. Driver accepts ride
            clientSocket.emit('accept-ride', { rideId: mockRide.id, driverId: 'driver-1' });
        });

        // 4. Passenger should receive acceptance
        clientSocket.on('ride-accepted', (data: any) => {
            expect(data.driverId).toBe('driver-1');
            done();
        });
    });

    test('should propagate location updates to the ride room', (done) => {
        const rideId = 'test-ride-123';
        const coords = { lat: 40.7128, lng: -74.0060 };

        // Join the ride room
        clientSocket.emit('join-ride', rideId);

        // Simulate driver sending location update
        clientSocket.emit('update-location', { rideId, coords });

        // Room should receive the update
        clientSocket.on('location-updated', (data: any) => {
            expect(data.lat).toBe(coords.lat);
            expect(data.lng).toBe(coords.lng);
            done();
        });
    });
});
