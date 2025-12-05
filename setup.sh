#!/bin/bash

echo "Setting up Copy Editor Practice Game..."
echo ""

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env file..."
    cat > backend/.env << EOF
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
EOF
    echo "✓ Created backend/.env"
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env and add your OpenAI API key!"
    echo ""
else
    echo "✓ backend/.env already exists"
fi

echo ""
echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Edit backend/.env and add your OpenAI API key"
echo "2. In one terminal: cd backend && npm run dev"
echo "3. In another terminal: cd frontend && npm run dev"
echo "4. Open http://localhost:3000 in your browser"

