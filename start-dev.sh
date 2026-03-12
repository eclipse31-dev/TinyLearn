#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting TinyLearn Development Environment${NC}"
echo ""

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo -e "${RED}PHP is not installed. Please install PHP first.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${YELLOW}Starting services...${NC}"
echo ""

# Start Laravel server
echo -e "${GREEN}[1/4]${NC} Starting Laravel server on http://localhost:8000"
php artisan serve &
LARAVEL_PID=$!

# Wait for Laravel to start
sleep 2

# Start Reverb WebSocket server
echo -e "${GREEN}[2/4]${NC} Starting Reverb WebSocket server on ws://localhost:8080"
php artisan reverb:start &
REVERB_PID=$!

# Wait for Reverb to start
sleep 2

# Start Queue worker
echo -e "${GREEN}[3/4]${NC} Starting Queue worker"
php artisan queue:work &
QUEUE_PID=$!

# Start React dev server
echo -e "${GREEN}[4/4]${NC} Starting React dev server on http://localhost:3000"
cd react
npm run dev &
REACT_PID=$!

echo ""
echo -e "${GREEN}✓ All services started!${NC}"
echo ""
echo -e "${YELLOW}Services running:${NC}"
echo "  • Laravel API: http://localhost:8000"
echo "  • React App: http://localhost:3000"
echo "  • WebSocket: ws://localhost:8080"
echo ""
echo -e "${YELLOW}Test Credentials:${NC}"
echo "  • Admin: admin@example.com / password"
echo "  • Teacher: teacher@example.com / password"
echo "  • Student: student@example.com / password"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Trap Ctrl+C to kill all processes
trap "kill $LARAVEL_PID $REVERB_PID $QUEUE_PID $REACT_PID 2>/dev/null; echo -e '\n${GREEN}Services stopped${NC}'; exit 0" INT

# Wait for all processes
wait
