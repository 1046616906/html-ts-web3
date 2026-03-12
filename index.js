import { createWalletClient, custom, createPublicClient, defineChain, parseEther, formatEther } from 'https://esm.sh/viem';
import { contractAddress, abi } from './constant-js.js';
const connectButton = document.getElementById('connectButton');
const balanceButton = document.getElementById('balanceButton');
const buyButton = document.getElementById('fundButton');
const amountInput = document.getElementById('amount');
const drawButton = document.getElementById('drawButton')
const addressToAmountFundedButton = document.getElementById('addressToAmountFunded')
let walletClient = null;
let publicClient = null;

async function connect() {
  // Implement your connection logic here
  if (window.ethereum !== 'undefined') {
    walletClient = createWalletClient({
      transport: custom(window.ethereum)
    })
    console.log(await walletClient.requestAddresses())
  } else {
    console.log('MetaMask is not installed. Please install it to use this app.');
  }
}

async function fund() {
  const amountValue = amountInput.value;
  if (window.ethereum !== 'undefined') {
    walletClient = createWalletClient({
      transport: custom(window.ethereum)
    })
    const [connectedAccount] = await walletClient.requestAddresses()
    const currentChain = await getCurrentChain(walletClient)
    publicClient = createPublicClient({
      transport: custom(window.ethereum)
    })

    const res = await publicClient.simulateContract({
      abi,
      address: contractAddress,
      functionName: 'fund',
      account: connectedAccount,
      chain: currentChain,
      value: parseEther(amountValue)
    })
    const hash = await walletClient.writeContract(res.request)
    console.log(hash)

  } else {
    console.log('MetaMask is not installed. Please install it to use this app.');
  }
}

async function withdraw() {
  if (window.ethereum !== 'undefined') {
    walletClient = await createWalletClient({
      transport: custom(window.ethereum)
    })
    const [contractAccount] = await walletClient.requestAddresses()
    const currentChain = await getCurrentChain(walletClient)

    publicClient = await createPublicClient({
      transport: custom(window.ethereum)
    })

    const res = await publicClient.simulateContract({
      address: contractAddress,
      chain: currentChain,
      abi,
      functionName: 'withdraw',
      account: contractAccount
    })
    const hash = await walletClient.writeContract(res.request)
    console.log(hash)
  }
}

async function getAddressToAmountFundedButton() {
  if (window.ethereum !== 'undefined') {
    walletClient = await createWalletClient({
      transport: custom(window.ethereum)
    })
    const [contractAccount] = await walletClient.requestAddresses()
    const currentChain = await getCurrentChain(walletClient)

    publicClient = await createPublicClient({
      transport: custom(window.ethereum)
    })

    const res = await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: 'getAddressToAmountFunded',
      args: [contractAccount]
    })
    // const hash = await walletClient.writeContract(res.request)
    console.log(formatEther(res) )
  }
}

async function getCurrentChain(client) {
  const chainId = await client.getChainId()
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://127.0.0.1:8545"],
      },
    },
  })
  return currentChain
}

async function getBalance() {
  if (window.ethereum !== 'undefined') {
    publicClient = await createPublicClient({
      transport: custom(window.ethereum)
    })

    const balance = await publicClient.getBalance({
      address: contractAddress
    })

    console.log(formatEther(balance))
  }
}
buyButton.onclick = fund
connectButton.onclick = connect
balanceButton.onclick = getBalance
drawButton.onclick = withdraw
addressToAmountFundedButton.onclick = getAddressToAmountFundedButton