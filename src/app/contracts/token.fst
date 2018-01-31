open Zen.Types
open Zen.Vector
open Zen.Util
open Zen.Base
open Zen.Cost
open Zen.Assets
open FStar.Mul

module ET = Zen.ErrorT
module Tx = Zen.TxSkeleton

val cf: txSkeleton -> string -> #l:nat -> wallet l -> cost nat 15
let cf _ _ #l _ = ret (64 + (64 + 64 + (l * 128 + 192)) + 20 + 18)

let buy txSkeleton contractHash =
  let pk = hashFromBase64 "DYggLLPq6eXj1YxjiPQ5dSvb/YVqAVNf8Mjnpc9P9BI=" in

  let! tokens = Tx.getAvailableTokens zenAsset txSkeleton in

  let txSkeleton =
    Tx.lockToContract zenAsset tokens contractHash txSkeleton
    >>= Tx.mint tokens contractHash
    >>= Tx.lockToPubKey contractHash tokens pk in

  ET.retT txSkeleton

let redeem #l txSkeleton contractHash (wallet:wallet l) =
  let pk = hashFromBase64 "DYggLLPq6eXj1YxjiPQ5dSvb/YVqAVNf8Mjnpc9P9BI=" in

  let! tokens = Tx.getAvailableTokens contractHash txSkeleton in

  let txSkeleton =
    Tx.destroy tokens contractHash txSkeleton
    >>= Tx.lockToPubKey zenAsset tokens pk
    >>= Tx.fromWallet zenAsset tokens contractHash wallet in

  ET.of_optionT "contract doesn't have enough zens to pay you" txSkeleton

val main: txSkeleton -> hash -> string -> #l:nat -> wallet l -> cost (result txSkeleton) (64 + (64 + 64 + (l * 128 + 192)) + 20 + 18)
let main txSkeleton contractHash command #l wallet =
  if command = "redeem" then
    redeem txSkeleton contractHash wallet
  else if command = "" || command = "buy" then
    buy txSkeleton contractHash
    |> autoInc
  else
    ET.autoFailw "unsupported command"
