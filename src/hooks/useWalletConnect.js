import { useState, useEffect, useCallback } from 'react';

export const useWalletConnect = () => {
    const [state, setState] = useState({
        isConnected: false,
        address: null,
        chainId: null,
        isLoading: false,
        error: null,
    });

    // Check if window.ethereum exists (MetaMask or similar wallet)
    useEffect(() => {
        const checkWalletConnection = async () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    // Check if already connected
                    const accounts = await window.ethereum.request({
                        method: 'eth_accounts',
                    });

                    const chainId = await window.ethereum.request({
                        method: 'eth_chainId',
                    });

                    if (accounts && accounts.length > 0) {
                        setState({
                            isConnected: true,
                            address: accounts[0],
                            chainId: parseInt(chainId, 16),
                            isLoading: false,
                            error: null,
                        });
                    }
                } catch (err) {
                    console.error('Error checking wallet:', err);
                }
            }
        };

        checkWalletConnection();

        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts && accounts.length > 0) {
                    setState(prev => ({
                        ...prev,
                        address: accounts[0],
                        isConnected: true,
                    }));
                } else {
                    setState(prev => ({
                        ...prev,
                        address: null,
                        isConnected: false,
                    }));
                }
            });

            window.ethereum.on('chainChanged', (chainId) => {
                setState(prev => ({
                    ...prev,
                    chainId: parseInt(chainId, 16),
                }));
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners?.('accountsChanged');
                window.ethereum.removeAllListeners?.('chainChanged');
            }
        };
    }, []);

    const connect = useCallback(async () => {
        if (!window.ethereum) {
            setState(prev => ({
                ...prev,
                error: 'MetaMask or Web3 wallet not detected. Please install MetaMask.',
            }));
            return;
        }

        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            const chainId = await window.ethereum.request({
                method: 'eth_chainId',
            });

            setState({
                isConnected: true,
                address: accounts[0],
                chainId: parseInt(chainId, 16),
                isLoading: false,
                error: null,
            });
        } catch (err) {
            const errorMessage = 
                err.code === -32603 
                    ? 'User rejected connection'
                    : err.message || 'Connection failed';
            
            setState(prev => ({
                ...prev,
                error: errorMessage,
                isLoading: false,
            }));
        }
    }, []);

    const disconnect = useCallback(() => {
        setState({
            isConnected: false,
            address: null,
            chainId: null,
            isLoading: false,
            error: null,
        });
    }, []);

    return {
        ...state,
        connect,
        disconnect,
    };
};