(* NAME_START:HODL Until: 1532244600000UL (07:30 UTC):NAME_END *)

open Zen.Types
open Zen.Base
open Zen.Cost
open Zen.Asset
open Zen.Data
open FStar.UInt64

module D = Zen.Dictionary
module W = Zen.Wallet
module CR = Zen.ContractResult
module OT = Zen.OptionT
module RT = Zen.ResultT
module Tx = Zen.TxSkeleton
module U64 = FStar.UInt64

// replace %uint64 with eg. 1532244600000UL
let maturityTimestamp = %uint64

//replace %pkhash with eg. "0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b"
let returnAddress = "%PKHASH%"

let getReturnAddress(): option lock `cost` 35 = //3
    let pkHash = Zen.Crypto.parseHash returnAddress in //32
    PKLock `OT.map` pkHash

let getWithdrawAmount (messageBody: option data): option U64.t `cost` 77 = //7
    messageBody >!= tryDict //4
                >?= D.tryFind "WithdrawAmount"//64
                >?= tryU64 //2

let deposit (txSkel: txSkeleton) (contractId: contractId)
                  : CR.t `cost` 182 = //16
    //let! contractToken = Zen.Asset.getDefault contractId in //64
    let! amount = Tx.getAvailableTokens zenAsset txSkel in //64
    let! returnAddress = getReturnAddress() in //35
    match returnAddress with
    | Some returnAddress ->
        Tx.lockToContract zenAsset amount contractId txSkel //64
        //>>= Tx.mint amount contractToken //64
        //>>= Tx.lockToAddress contractToken amount returnAddress //64
        >>= CR.ofTxSkel //3
    | None -> RT.incFailw 67 "Something went wrong! could not parse return address"

let withdraw (txSkel: txSkeleton) ({timestamp=timestamp}: context)
             (contractId: contractId) (messageBody: option data)
             (wallet: wallet): CR.t `cost` (Zen.Wallet.size wallet * 128 + 410) = //39
    //let! contractToken = Zen.Asset.getDefault contractId in //64
    //let! amount = Tx.getAvailableTokens contractToken txSkel in //64
    let! withdrawAmount = getWithdrawAmount messageBody in //77
    let! returnAddress = getReturnAddress() in //35
    match withdrawAmount, returnAddress with
    | Some withdrawAmount, Some returnAddress ->
        if timestamp >=^ maturityTimestamp then begin
            let! txSkel = //Tx.destroy amount contractToken txSkel //64
                          //>>= Tx.lockToAddress zenAsset amount returnAddress //64
                          Tx.lockToAddress zenAsset withdrawAmount returnAddress txSkel //64
                          >>= Tx.fromWallet zenAsset withdrawAmount contractId wallet in //w*128+192
            match txSkel with
            | Some txSkel -> CR.ofTxSkel txSkel //3
            | None -> RT.incFailw 3 "Something went wrong! could not get txSkel from wallet"
            end
        else RT.autoFailw "Not done HODLing"
    | None, _ -> RT.autoFailw "Message body must include WithdrawAmount in the following format: 'WithdrawAmount: 100ZP'"
    | Some _, None -> RT.autoFailw "Something went wrong! could not parse return address"

let main (txSkel: txSkeleton) (context: context) (contractId: contractId)
         (command: string) (_: sender) (messageBody: option data)
         (wallet: wallet) (_: option data)
         : CR.t `cost` (Zen.Wallet.size wallet * 128 + 418) = //8
    match command with
    | "Withdraw" -> withdraw txSkel context contractId messageBody wallet
    | "Deposit" -> deposit txSkel contractId |> autoInc
    | _ -> RT.autoFailw "Command not recognised"

let cf _ _ _ _ _ wallet _ : nat `cost` 7 =
    W.size wallet * 128 + 418 |> ret
