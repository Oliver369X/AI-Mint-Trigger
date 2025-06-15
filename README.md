# MiniApp: AI-Generated NFT Minter with Sherry

This project is a mini-application designed to mint AI-generated NFTs, built to integrate seamlessly with the Sherry platform. It features a Node.js/TypeScript backend for handling AI image generation and IPFS uploads, and a Next.js (React) frontend that acts as the user interface when embedded within the Sherry platform.

## Features

*   **AI Image Generation**: Utilizes the  Modal API to create unique images based on user prompts.
*   **IPFS Storage**: Leverages Pinata to upload generated images and NFT metadata to IPFS, ensuring decentralized and permanent storage.
*   **NFT Minting**: Interacts with an ERC721 smart contract to mint new NFTs, with transaction preparation handled by the backend.
*   **Sherry Platform Integration**: Designed to be consumed by the Sherry platform, providing a rich user experience for NFT minting within the Sherry ecosystem.

## Technologies Used

### Backend (`minithon/`)
*   **Node.js**: JavaScript runtime environment.
*   **TypeScript**: Typed superset of JavaScript.
*   **Express**: Web framework for Node.js.
*   **Axios**: Promise-based HTTP client.
*   **dotenv**: Loads environment variables from a `.env` file.
*   **Pinata SDK**: For interacting with Pinata's IPFS services.
*   **node-fetch**: A light-weight module that brings `window.fetch` to Node.js.
*   **Jest**: JavaScript testing framework.
*   **ts-node**: TypeScript execution environment for Node.js.
*   **concurrently**: Runs multiple commands concurrently.

### Frontend (`minithon/mi-sherry-app/`)
*   **Next.js**: React framework for production.
*   **React**: JavaScript library for building user interfaces.
*   **Wagmi**: React Hooks for Ethereum.
*   **Viem**: TypeScript Interface for Ethereum.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **pino-pretty**: Pretty-prints Pino logs.

### Blockchain Interaction
*   **ERC721 Smart Contract**: The NFT contract deployed on a blockchain (e.g., Avalanche Fuji).
*   **Sherry SDK**: Used in the backend to create metadata for the mini-app and serialize blockchain transactions.

## Project Structure

```
minithon/
├── src/                      # Backend source code
│   ├── blockchain/
│   │   └── abi.ts            # Smart contract ABI
│   ├── controllers/
│   ├── services/
│   ├── index.ts              # Backend entry point
│   └── ...
├── mi-sherry-app/            # Next.js Frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   └── mint-nft/ # API routes for Sherry integration
│   │   │   │       └── route.ts
│   │   │   ├── globals.css   # Global styles including Tailwind
│   │   │   └── layout.tsx    # Root layout for Next.js app
│   │   │   └── page.tsx      # Main page for the mini-app
│   │   ├── components/
│   │   │   └── providers/
│   │   │       └── Web3Provider.tsx # Wagmi/React Query setup
│   │   └── lib/
│   │       └── sherry-init.ts # Sherry SDK initialization (commented out for local testing)
│   ├── public/               # Static assets
│   ├── next.config.js        # Next.js configuration
│   ├── package.json          # Frontend dependencies and scripts
│   ├── postcss.config.js     # PostCSS configuration for Tailwind
│   └── tailwind.config.js    # Tailwind CSS configuration
├── .env.example              # Example environment variables
├── package.json              # Root package.json for common scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd minithon
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root `minithon/` directory and populate it with your API keys and contract address:
    ```env
    PINATA_JWT=YOUR_PINATA_JWT
    MODAL_API_KEY=YOUR_MODAL_API_KEY
    CONTRACT_ADDRESS=YOUR_NFT_CONTRACT_ADDRESS # e.g., 0xC266AD11F3b27B6F4d223906dB60794F28815623
    BACKEND_URL=http://localhost:3000
    ```

3.  **Install Dependencies:**
    Install dependencies for both the backend and frontend.
    ```bash
    npm install # Installs backend dependencies and concurrently
    cd mi-sherry-app
    npm install # Installs frontend dependencies (Next.js, React, Wagmi, Tailwind, pino-pretty)
    cd .. # Go back to the root minithon directory
    ```

## Running the Application Locally

To run both the backend and frontend in development mode:

```bash
npm run dev
```

*   The backend will typically run on `http://localhost:3000`.
*   The frontend (Next.js app) will usually run on `http://localhost:3001` (since the backend occupies port 3000).

Open your browser and navigate to `http://localhost:3001` to view the mini-app's static information page.

**Note on Frontend Interaction:**
The local frontend (`http://localhost:3001`) serves as a display for the mini-app's basic information. The actual interactive elements for NFT minting (input fields for `prompt`, `collectionId`, and wallet connection) are dynamically generated and handled by the **Sherry platform** when your mini-app is integrated and accessed through it.

## Sherry Platform Integration Flow

The mini-app interacts with the Sherry platform via two primary API endpoints:

1.  **`GET /api/mint-nft`**:
    *   **Purpose**: Sherry calls this endpoint to retrieve metadata about your mini-app's required inputs (e.g., `prompt`, `collectionId`).
    *   **Backend Logic**: Your `route.ts` uses `@sherrylinks/sdk`'s `createMetadata` function to define these parameters.
    *   **Sherry's Role**: Based on this metadata, Sherry dynamically constructs the user interface (UI) with appropriate input fields for the user.

2.  **`POST /api/mint-nft`**:
    *   **Purpose**: After the user interacts with the UI generated by Sherry and submits the form, Sherry sends a POST request to this endpoint with the user's inputs (`prompt`, `collectionId`, `userWallet`).
    *   **Backend Logic**:
        1.  Calls internal APIs to generate an AI image based on the `prompt`.
        2.  Uploads the generated image to IPFS.
        3.  Creates NFT metadata (name, description, IPFS image URI).
        4.  Uploads the NFT metadata to IPFS.
        5.  Uses the contract ABI (`src/blockchain/abi.ts`) to encode the `mint` function call with `userWallet`, `collectionId`, and the IPFS metadata URI.
        6.  Serializes the prepared blockchain transaction (e.g., `to`, `data`, `value`).
    *   **Sherry's Role**: Receives the serialized transaction from your backend, presents it to the user for signature (via their connected wallet), and then submits the signed transaction to the blockchain.

## Important Notes

*   **`CONTRACT_ADDRESS` vs. `OWNER_PRIVATE_KEY`**:
    *   `CONTRACT_ADDRESS` is the address of your deployed NFT smart contract, used by the backend to prepare the `mint` transaction.
    *   `OWNER_PRIVATE_KEY` is the private key of the contract owner. It is **not** used for user minting actions. It is typically used for contract deployment or owner-only functions (e.g., setting mint fees, transferring ownership).
*   **User Wallet**: The user's wallet address (`userWallet`) is provided to your backend by the Sherry platform. Your mini-app does not directly handle wallet connections in the frontend.
*   **`abi.ts`**: This file is crucial as it provides the Application Binary Interface (ABI) of your smart contract, allowing the backend to correctly encode function calls (like `mint`) to the contract.

## Deployment

To test the full functionality and integrate with the Sherry platform, you will need to deploy your mini-app (e.g., on Vercel for the Next.js app and a hosting provider for the Node.js backend if not combined). Once deployed, you can register your mini-app's API endpoint with Sherry.
