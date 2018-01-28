open Zen.Types
open Zen.Vector
open Zen.Util
open Zen.Base
open Zen.Cost

module ET = Zen.ErrorT

val cf: txSkeleton -> string -> cost nat 1
let cf _ _ = ret 149

val main: txSkeleton -> hash -> string -> cost (result txSkeleton) 149
let main txSkeleton contractHash command =
let spend = {
  asset=hashFromBase64 "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  amount=1000UL
  } in
  let lock = ContractLock contractHash in

  let output = { lock=lock; spend=spend } in

  let pInput = {
    txHash = hashFromBase64 "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    index = 0ul
    }, output in

    let txSkeleton1 = addInput pInput txSkeleton in
    let txSkeleton2 = txSkeleton1 >>= lockToContract spend.asset spend.amount contractHash in
    ET.retT txSkeleton2
