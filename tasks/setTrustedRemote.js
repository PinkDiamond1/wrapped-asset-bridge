const { getWalletContract } = require("../utils/crossChainHelper")
const CHAIN_IDS = require("../constants/chainIds.json")

module.exports = async function (taskArgs, hre) {
	const originalNetworks = taskArgs.originalNetworks.split(",")
	const wrappedNetwork = taskArgs.wrappedNetwork

	const wrappedTokenBridge = await getWalletContract(hre, wrappedNetwork, "WrappedTokenBridge")
	const wrappedTokenChainId = CHAIN_IDS[wrappedNetwork]

	for (let i = 0; i < originalNetworks.length; i++) {
		const originalTokenChainId = CHAIN_IDS[originalNetworks[i]]
		const originalTokenBridge = await getWalletContract(hre, originalNetworks[i], "OriginalTokenBridge")
		console.log(`\n[${originalNetworks[i]}] OriginalTokenBridge at ${originalTokenBridge.address} calling setTrustedRemoteAddress(${wrappedTokenChainId}, ${wrappedTokenBridge.address})`)
		await originalTokenBridge.setTrustedRemoteAddress(wrappedTokenChainId, wrappedTokenBridge.address)
		
		console.log(`[${wrappedNetwork}] WrappedTokenBridge at ${wrappedTokenBridge.address} calling setTrustedRemoteAddress(${originalTokenChainId}, ${originalTokenBridge.address})`)
		await wrappedTokenBridge.setTrustedRemoteAddress(originalTokenChainId, originalTokenBridge.address)
	}
}
