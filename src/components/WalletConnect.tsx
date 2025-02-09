import { usePrivy } from '@privy-io/react-auth';

function WalletConnect() {
  const { login, ready, authenticated, user } = usePrivy();

  console.log('Privy state:', { ready, authenticated, user });

  const handleConnect = async () => {
    try {
      console.log('Attempting to connect...');
      await login();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <button 
      onClick={handleConnect}
      disabled={!ready}
    >
      Connect Wallet
    </button>
  );
}

export default WalletConnect; 