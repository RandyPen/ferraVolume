import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction, Inputs, coinWithBalance } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { generateSHA256Hash } from './generate-hash-with-lib';
import BN = require('bn.js');


const USDCType = "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";
const USDTType = "0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT";
const PoolAddress = "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8";

const getKeypairAndWallet = () => {
    const mnemonics: string = process.env.MNEMONICS!;
    const i = 0;
    const path = `m/44'/784'/${i}'/0'/0'`;
    const keypair = Ed25519Keypair.deriveKeypair(mnemonics, path);
    const wallet = keypair.toSuiAddress();
    return { keypair, wallet };
};

export const swapAllFerraCT = async () => {
    const { keypair, wallet } = getKeypairAndWallet();

    const suiClient = new SuiClient({
        url: process.env.RPC!,
    });

    const balanceInfo = await suiClient.getBalance({ owner: wallet, coinType: USDCType });
    const balanceAmount = new BN(balanceInfo.totalBalance);
    console.log(`balanceAmount: ${balanceAmount.toString()}`);
    // Calculate amountOutLimit as 99.9% of balanceAmount
    const amountOutLimit = balanceAmount.mul(new BN(999)).div(new BN(1000));
    console.log(`amountOutLimit (99.9%): ${amountOutLimit.toString()}`);

    const tx = new Transaction()
    const orderId = generateSHA256Hash()
    const [swapContext] = tx.moveCall({
        package: "0xde5d696a79714ca5cb910b9aed99d41f67353abb00715ceaeb0663d57ee39640",
        module: "router",
        function: "new_swap_context",
        arguments: [
            tx.pure(bcs.String.serialize(orderId)),
            tx.pure(bcs.U64.serialize(amountOutLimit.toString())),
            tx.pure(bcs.U64.serialize(amountOutLimit.toString())),
            coinWithBalance({ type: USDCType, balance: BigInt(balanceAmount.toString()) }),
            tx.pure(bcs.U32.serialize(0)),
            tx.pure(bcs.Address.serialize('0x0000000000000000000000000000000000000000000000000000000000000000')),
        ],
        typeArguments: [
            USDCType,
            USDCType,
        ],
    });

    tx.moveCall({
        package: "0x5768990a8c4df9f57e08ab4e61204040041e79aa506cd8bfe1a86833c02a4499",
        module: "ferra_dlmm",
        function: "swap",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x5c9dacf5a678ea15b8569d65960330307e23d429289ca380e665b1aa175ebeca", 
                initialSharedVersion: "644138508", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8", 
                initialSharedVersion: "644628785", 
                mutable: true 
            })),
            tx.pure(bcs.Bool.serialize(true)),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            USDTType,
        ],
    });
    tx.moveCall({
        package: "0x5768990a8c4df9f57e08ab4e61204040041e79aa506cd8bfe1a86833c02a4499",
        module: "ferra_dlmm",
        function: "swap",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x5c9dacf5a678ea15b8569d65960330307e23d429289ca380e665b1aa175ebeca", 
                initialSharedVersion: "644138508", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8", 
                initialSharedVersion: "644628785", 
                mutable: true 
            })),
            tx.pure(bcs.Bool.serialize(false)),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            USDTType,
        ],
    });

    tx.moveCall({
        package: "0x5768990a8c4df9f57e08ab4e61204040041e79aa506cd8bfe1a86833c02a4499",
        module: "ferra_dlmm",
        function: "swap",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x5c9dacf5a678ea15b8569d65960330307e23d429289ca380e665b1aa175ebeca", 
                initialSharedVersion: "644138508", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8", 
                initialSharedVersion: "644628785", 
                mutable: true 
            })),
            tx.pure(bcs.Bool.serialize(true)),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            USDTType,
        ],
    });
    tx.moveCall({
        package: "0x5768990a8c4df9f57e08ab4e61204040041e79aa506cd8bfe1a86833c02a4499",
        module: "ferra_dlmm",
        function: "swap",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x5c9dacf5a678ea15b8569d65960330307e23d429289ca380e665b1aa175ebeca", 
                initialSharedVersion: "644138508", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8", 
                initialSharedVersion: "644628785", 
                mutable: true 
            })),
            tx.pure(bcs.Bool.serialize(false)),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            USDTType,
        ],
    });


    tx.moveCall({
        package: "0x5768990a8c4df9f57e08ab4e61204040041e79aa506cd8bfe1a86833c02a4499",
        module: "ferra_dlmm",
        function: "swap",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x5c9dacf5a678ea15b8569d65960330307e23d429289ca380e665b1aa175ebeca", 
                initialSharedVersion: "644138508", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8", 
                initialSharedVersion: "644628785", 
                mutable: true 
            })),
            tx.pure(bcs.Bool.serialize(true)),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            USDTType,
        ],
    });
    tx.moveCall({
        package: "0x5768990a8c4df9f57e08ab4e61204040041e79aa506cd8bfe1a86833c02a4499",
        module: "ferra_dlmm",
        function: "swap",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x5c9dacf5a678ea15b8569d65960330307e23d429289ca380e665b1aa175ebeca", 
                initialSharedVersion: "644138508", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8", 
                initialSharedVersion: "644628785", 
                mutable: true 
            })),
            tx.pure(bcs.Bool.serialize(false)),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            USDTType,
        ],
    });

    const [coin] = tx.moveCall({
        package: "0xde5d696a79714ca5cb910b9aed99d41f67353abb00715ceaeb0663d57ee39640",
        module: "router",
        function: "confirm_swap",
        arguments: [
            swapContext!,
        ],
        typeArguments: [
            USDCType,
        ],
    });

    tx.transferObjects([coin!], wallet);
    tx.setGasBudget(2_000_000_000);
    tx.setSender(wallet);

    // const dataSentToFullnode = await tx.build({ client: suiClient });
    // const dryrun_result = await suiClient.dryRunTransactionBlock({
    //     transactionBlock: dataSentToFullnode,
    // });
    // console.log(dryrun_result.balanceChanges);
    const result = await suiClient.signAndExecuteTransaction({ transaction: tx, signer: keypair });
    console.log("result", result);
}

export const swapAllFerraTC = async () => {
    const { keypair, wallet } = getKeypairAndWallet();

    const suiClient = new SuiClient({
        url: process.env.RPC!,
    });

    const balanceInfo = await suiClient.getBalance({ owner: wallet, coinType: USDTType });
    const balanceAmount = new BN(balanceInfo.totalBalance);
    console.log(`balanceAmount: ${balanceAmount.toString()}`);
    // Calculate amountOutLimit as 99.9% of balanceAmount
    const amountOutLimit = balanceAmount.mul(new BN(999)).div(new BN(1000));
    console.log(`amountOutLimit (99.9%): ${amountOutLimit.toString()}`);

    const tx = new Transaction()
    const orderId = generateSHA256Hash()
    const [swapContext] = tx.moveCall({
        package: "0xde5d696a79714ca5cb910b9aed99d41f67353abb00715ceaeb0663d57ee39640",
        module: "router",
        function: "new_swap_context",
        arguments: [
            tx.pure(bcs.String.serialize(orderId)),
            tx.pure(bcs.U64.serialize(amountOutLimit.toString())),
            tx.pure(bcs.U64.serialize(amountOutLimit.toString())),
            coinWithBalance({ type: USDTType, balance: BigInt(balanceAmount.toString()) }),
            tx.pure(bcs.U32.serialize(0)),
            tx.pure(bcs.Address.serialize('0x0000000000000000000000000000000000000000000000000000000000000000')),
        ],
        typeArguments: [
            USDTType,
            USDTType,
        ],
    });

    tx.moveCall({
        package: "0x5768990a8c4df9f57e08ab4e61204040041e79aa506cd8bfe1a86833c02a4499",
        module: "ferra_dlmm",
        function: "swap",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x5c9dacf5a678ea15b8569d65960330307e23d429289ca380e665b1aa175ebeca", 
                initialSharedVersion: "644138508", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8", 
                initialSharedVersion: "644628785", 
                mutable: true 
            })),
            tx.pure(bcs.Bool.serialize(false)),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            USDTType,
        ],
    });
    tx.moveCall({
        package: "0x5768990a8c4df9f57e08ab4e61204040041e79aa506cd8bfe1a86833c02a4499",
        module: "ferra_dlmm",
        function: "swap",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x5c9dacf5a678ea15b8569d65960330307e23d429289ca380e665b1aa175ebeca", 
                initialSharedVersion: "644138508", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8", 
                initialSharedVersion: "644628785", 
                mutable: true 
            })),
            tx.pure(bcs.Bool.serialize(true)),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            USDTType,
        ],
    });

    tx.moveCall({
        package: "0x5768990a8c4df9f57e08ab4e61204040041e79aa506cd8bfe1a86833c02a4499",
        module: "ferra_dlmm",
        function: "swap",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x5c9dacf5a678ea15b8569d65960330307e23d429289ca380e665b1aa175ebeca", 
                initialSharedVersion: "644138508", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8", 
                initialSharedVersion: "644628785", 
                mutable: true 
            })),
            tx.pure(bcs.Bool.serialize(false)),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            USDTType,
        ],
    });
    tx.moveCall({
        package: "0x5768990a8c4df9f57e08ab4e61204040041e79aa506cd8bfe1a86833c02a4499",
        module: "ferra_dlmm",
        function: "swap",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x5c9dacf5a678ea15b8569d65960330307e23d429289ca380e665b1aa175ebeca", 
                initialSharedVersion: "644138508", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8", 
                initialSharedVersion: "644628785", 
                mutable: true 
            })),
            tx.pure(bcs.Bool.serialize(true)),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            USDTType,
        ],
    });


    tx.moveCall({
        package: "0x5768990a8c4df9f57e08ab4e61204040041e79aa506cd8bfe1a86833c02a4499",
        module: "ferra_dlmm",
        function: "swap",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x5c9dacf5a678ea15b8569d65960330307e23d429289ca380e665b1aa175ebeca", 
                initialSharedVersion: "644138508", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8", 
                initialSharedVersion: "644628785", 
                mutable: true 
            })),
            tx.pure(bcs.Bool.serialize(false)),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            USDTType,
        ],
    });
    tx.moveCall({
        package: "0x5768990a8c4df9f57e08ab4e61204040041e79aa506cd8bfe1a86833c02a4499",
        module: "ferra_dlmm",
        function: "swap",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x5c9dacf5a678ea15b8569d65960330307e23d429289ca380e665b1aa175ebeca", 
                initialSharedVersion: "644138508", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x1ccab41d982f291fd35b719439b7d4c9429a77d75e9453effbb822f784343bb8", 
                initialSharedVersion: "644628785", 
                mutable: true 
            })),
            tx.pure(bcs.Bool.serialize(true)),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            USDTType,
        ],
    });

    const [coin] = tx.moveCall({
        package: "0xde5d696a79714ca5cb910b9aed99d41f67353abb00715ceaeb0663d57ee39640",
        module: "router",
        function: "confirm_swap",
        arguments: [
            swapContext!,
        ],
        typeArguments: [
            USDTType,
        ],
    });

    tx.transferObjects([coin!], wallet);
    tx.setGasBudget(2_000_000_000);
    tx.setSender(wallet);

    // const dataSentToFullnode = await tx.build({ client: suiClient });
    // const dryrun_result = await suiClient.dryRunTransactionBlock({
    //     transactionBlock: dataSentToFullnode,
    // });
    // console.log(dryrun_result);
    const result = await suiClient.signAndExecuteTransaction({ transaction: tx, signer: keypair });
    console.log("result", result);
}
