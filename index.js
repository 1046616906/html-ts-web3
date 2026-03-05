import { createWalletClient, custom, createPublicClient, simulateContract } from 'https://esm.sh/viem';
import { contractAddress, abi } from './contract-js.js';
const connectButton = document.getElementById('connectButton');
const balanceButton = document.getElementById('balanceButton');
const buyButton = document.getElementById('buyButton');
const amountInput = document.getElementById('amount');

let walletClient = null;
let publicClient = null;

async function connect () {
  // Implement your connection logic here
  if (typeof window.ethereum !== 'undefined') {
    walletClient = createWalletClient({
      transport: custom(window.ethereum)
    })


    console.log(await walletClient.requestAddresses())
  } else {
    console.log('MetaMask is not installed. Please install it to use this app.');
  }
}

async function fund () {
  const amountValue = amountInput.value;
  if (typeof window.ethereum !== 'undefined') {
    walletClient = createWalletClient({
      transport: custom(window.ethereum)
    })
    await walletClient.requestAddresses()

    publicClient = createPublicClient({
      transport: custom(window.ethereum)
    })

    publicClient.simulateContract({
      abi,
      address: contractAddress,
      
    })

  } else {
    console.log('MetaMask is not installed. Please install it to use this app.');
  }
}

connectButton.onclick = connect