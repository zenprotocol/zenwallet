open Zen.Types
open Zen.Vector
open Zen.Util

val test: transactionSkeleton -> hash -> transactionSkeleton
let test (Tx inputs outputs data) hash =
  let output = {
    lock = ContractLock hash 0 Empty;
    spend = {
      asset = hash;
      amount = 1000UL
    }
  } in

  let input = {
      txHash = hashFromBase64 "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
      index = 0ul
  } in

  let outputs' = VCons output outputs in
  let inputs' = VCons input inputs in
  Tx inputs' outputs' data
