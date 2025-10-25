import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import leaderboardABI from '../contractsABI/leaderBoard.json';
import predictionABI from '../contractsABI/prediction.json';
import nftABI from '../contractsABI/nft.json';

const CONTRACT_ADDRESSES = {
    leaderboard: '0xcb3c47090452195847ed5c2cb60f1ad8dba99796',
    prediction: '0x4fa768516c337a1cf889d0c5cc5def1dc31570cb',
    nft: '0xa8e2d5a4f7d50f9de8e6f2cf6b937aca40d6d5d2',
};

// RPC endpoints for different networks
const RPC_ENDPOINTS = {
    1: 'https://eth.llamarpc.com', // Mainnet
    84532: 'https://sepolia.base.org', // Sepolia testnet
    42161: 'https://arb1.arbitrum.io/rpc', // Arbitrum
    137: 'https://polygon-rpc.com', // Polygon
    56: 'https://bsc-dataseed1.defibit.io:8545', // BSC
};

export const useSmartContracts = (address, isConnected) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chainId, setChainId] = useState(null);

    // Get the correct RPC endpoint for the current chain
    const getRPCUrl = useCallback(async () => {
        try {
            if (!window.ethereum) throw new Error('Wallet not found');
            
            // Get current chain ID from wallet
            const chainIdHex = await window.ethereum.request({
                method: 'eth_chainId',
            });
            const id = parseInt(chainIdHex, 16);
            setChainId(id);

            return RPC_ENDPOINTS[id] || RPC_ENDPOINTS[1]; // Default to Mainnet if not found
        } catch (err) {
            console.error('Error getting RPC URL:', err);
            return RPC_ENDPOINTS[1]; // Fallback to mainnet
        }
    }, []);

    const getProvider = useCallback(async () => {
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask or Web3 wallet not detected');
            }
            // Use ethers BrowserProvider which wraps window.ethereum
            return new ethers.BrowserProvider(window.ethereum);
        } catch (err) {
            console.error('Error getting provider:', err);
            throw err;
        }
    }, []);

    const getSigner = useCallback(async () => {
        try {
            const provider = await getProvider();
            return await provider.getSigner();
        } catch (err) {
            console.error('Error getting signer:', err);
            throw new Error('Failed to get wallet signer. Make sure wallet is connected.');
        }
    }, [getProvider]);

    // Validate contract address
    const isValidAddress = (addr) => {
        return ethers.isAddress(addr);
    };

    // Leaderboard Contract Functions
    const submitBattle = useCallback(
        async (coinA, coinB, predictedWinner, actualWinner, performanceDelta, scoreA, scoreB) => {
            if (!isConnected) throw new Error('Wallet not connected');
            if (!address) throw new Error('Address not available');
            
            try {
                setLoading(true);
                setError(null);

                // Validate inputs
                if (!coinA || !coinB || !predictedWinner || !actualWinner) {
                    throw new Error('Missing required parameters');
                }

                // Validate contract address
                if (!isValidAddress(CONTRACT_ADDRESSES.leaderboard)) {
                    throw new Error('Invalid leaderboard contract address');
                }

                const signer = await getSigner();
                const contract = new ethers.Contract(
                    CONTRACT_ADDRESSES.leaderboard,
                    leaderboardABI.abi,
                    signer
                );

                // Convert performance delta from percentage to basis points (multiply by 100)
                const deltaInBasisPoints = Math.floor(performanceDelta * 100);

                console.log('Submitting battle:', {
                    coinA,
                    coinB,
                    predictedWinner,
                    actualWinner,
                    delta: deltaInBasisPoints,
                    scoreA,
                    scoreB,
                });

                const tx = await contract.submitBattle(
                    coinA,
                    coinB,
                    predictedWinner,
                    actualWinner,
                    deltaInBasisPoints,
                    scoreA,
                    scoreB
                );

                console.log('Transaction sent:', tx.hash);
                const receipt = await tx.wait();
                
                console.log('Transaction confirmed:', receipt.hash);
                return {
                    success: true,
                    transactionHash: receipt.hash,
                    blockNumber: receipt.blockNumber,
                };
            } catch (err) {
                const errorMsg = err.reason || err.message || 'Failed to submit battle';
                console.error('Submit battle error:', err);
                setError(errorMsg);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [isConnected, address, getSigner]
    );

    const getUserStats = useCallback(
        async (userAddress = null) => {
            try {
                setLoading(true);
                setError(null);

                if (!userAddress && !address) {
                    throw new Error('No address provided');
                }

                if (!isValidAddress(CONTRACT_ADDRESSES.leaderboard)) {
                    throw new Error('Invalid leaderboard contract address');
                }

                const provider = await getProvider();
                const contract = new ethers.Contract(
                    CONTRACT_ADDRESSES.leaderboard,
                    leaderboardABI.abi,
                    provider
                );

                const targetAddress = userAddress || address;
                const stats = await contract.getUserStats(targetAddress);

                return {
                    totalPredictions: stats.totalPredictions.toString(),
                    correctPredictions: stats.correctPredictions.toString(),
                    wrongPredictions: stats.wrongPredictions.toString(),
                    points: stats.points.toString(),
                    highestDelta: (parseInt(stats.highestDelta) / 100).toFixed(2),
                    lastBattleTime: new Date(parseInt(stats.lastBattleTime) * 1000),
                };
            } catch (err) {
                const errorMsg = err.message || 'Failed to fetch user stats';
                console.error('Get user stats error:', err);
                setError(errorMsg);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [address, getProvider]
    );

    const getAccuracy = useCallback(
        async (userAddress = null) => {
            try {
                setError(null);

                if (!userAddress && !address) {
                    throw new Error('No address provided');
                }

                if (!isValidAddress(CONTRACT_ADDRESSES.leaderboard)) {
                    throw new Error('Invalid leaderboard contract address');
                }

                const provider = await getProvider();
                const contract = new ethers.Contract(
                    CONTRACT_ADDRESSES.leaderboard,
                    leaderboardABI.abi,
                    provider
                );

                const targetAddress = userAddress || address;
                const accuracy = await contract.getAccuracy(targetAddress);
                return parseInt(accuracy);
            } catch (err) {
                const errorMsg = err.message || 'Failed to fetch accuracy';
                console.error('Get accuracy error:', err);
                setError(errorMsg);
                throw err;
            }
        },
        [address, getProvider]
    );

    // Prediction Contract Functions
    const submitPrediction = useCallback(
        async (coinA, coinB, predictedWinner) => {
            if (!isConnected) throw new Error('Wallet not connected');
            if (!address) throw new Error('Address not available');

            try {
                setLoading(true);
                setError(null);

                if (!coinA || !coinB || !predictedWinner) {
                    throw new Error('Missing required parameters');
                }

                if (!isValidAddress(CONTRACT_ADDRESSES.prediction)) {
                    throw new Error('Invalid prediction contract address');
                }

                const signer = await getSigner();
                const contract = new ethers.Contract(
                    CONTRACT_ADDRESSES.prediction,
                    predictionABI.abi,
                    signer
                );

                console.log('Submitting prediction:', {
                    coinA,
                    coinB,
                    predictedWinner,
                });

                const tx = await contract.submitPrediction(coinA, coinB, predictedWinner);
                console.log('Prediction transaction sent:', tx.hash);
                
                const receipt = await tx.wait();
                console.log('Prediction transaction confirmed:', receipt.hash);

                return {
                    success: true,
                    transactionHash: receipt.hash,
                    blockNumber: receipt.blockNumber,
                };
            } catch (err) {
                const errorMsg = err.reason || err.message || 'Failed to submit prediction';
                console.error('Submit prediction error:', err);
                setError(errorMsg);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [isConnected, address, getSigner]
    );

    const getPlayerPredictions = useCallback(
        async (userAddress = null) => {
            try {
                setError(null);

                if (!userAddress && !address) {
                    throw new Error('No address provided');
                }

                if (!isValidAddress(CONTRACT_ADDRESSES.prediction)) {
                    throw new Error('Invalid prediction contract address');
                }

                const provider = await getProvider();
                const contract = new ethers.Contract(
                    CONTRACT_ADDRESSES.prediction,
                    predictionABI.abi,
                    provider
                );

                const targetAddress = userAddress || address;
                const predictions = await contract.getPlayerPredictions(targetAddress);
                return predictions.map(id => id.toString());
            } catch (err) {
                const errorMsg = err.message || 'Failed to fetch predictions';
                console.error('Get predictions error:', err);
                setError(errorMsg);
                throw err;
            }
        },
        [address, getProvider]
    );

    // NFT Contract Functions
    const mintBattleNFT = useCallback(
        async (metadataUri) => {
            if (!isConnected) throw new Error('Wallet not connected');
            if (!address) throw new Error('Address not available');

            try {
                setLoading(true);
                setError(null);

                if (!metadataUri) {
                    throw new Error('Metadata URI is required');
                }

                if (!isValidAddress(CONTRACT_ADDRESSES.nft)) {
                    throw new Error('Invalid NFT contract address');
                }

                const signer = await getSigner();
                const contract = new ethers.Contract(
                    CONTRACT_ADDRESSES.nft,
                    nftABI.abi,
                    signer
                );

                console.log('Minting NFT for:', address);

                const tx = await contract.mintBattleNFT(address, metadataUri);
                console.log('Mint transaction sent:', tx.hash);
                
                const receipt = await tx.wait();
                console.log('Mint transaction confirmed:', receipt.hash);

                return {
                    success: true,
                    transactionHash: receipt.hash,
                    blockNumber: receipt.blockNumber,
                };
            } catch (err) {
                const errorMsg = err.reason || err.message || 'Failed to mint NFT';
                console.error('Mint NFT error:', err);
                setError(errorMsg);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [isConnected, address, getSigner]
    );

    const getBalance = useCallback(
        async (userAddress = null) => {
            try {
                setError(null);

                if (!userAddress && !address) {
                    throw new Error('No address provided');
                }

                if (!isValidAddress(CONTRACT_ADDRESSES.nft)) {
                    throw new Error('Invalid NFT contract address');
                }

                const provider = await getProvider();
                const contract = new ethers.Contract(
                    CONTRACT_ADDRESSES.nft,
                    nftABI.abi,
                    provider
                );

                const targetAddress = userAddress || address;
                const balance = await contract.balanceOf(targetAddress);
                return parseInt(balance);
            } catch (err) {
                const errorMsg = err.message || 'Failed to fetch NFT balance';
                console.error('Get balance error:', err);
                setError(errorMsg);
                throw err;
            }
        },
        [address, getProvider]
    );

    return {
        // Leaderboard
        submitBattle,
        getUserStats,
        getAccuracy,
        
        // Predictions
        submitPrediction,
        getPlayerPredictions,
        
        // NFT
        mintBattleNFT,
        getBalance,

        // State
        loading,
        error,
        chainId,
    };
};