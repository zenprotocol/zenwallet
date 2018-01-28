open Zen.Types
open Zen.Vector
open Zen.Util
open Zen.Base
open Zen.Cost

module ET = Zen.ErrorT

val cf: txSkeleton -> string -> cost nat 1
let cf _ _ = ret 277

val main: txSkeleton -> hash -> string -> cost (result txSkeleton) 277
let main txSkeleton contractHash command =
let zenToken:asset = hashFromBase64 "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" in
let pk = hashFromBase64 "DYggLLPq6eXj1YxjiPQ5dSvb/YVqAVNf8Mjnpc9P9BI=" in

let! tokens = getAvailableTokens zenToken txSkeleton in

let txSkeleton =
    lockToContract ({asset=zenToken;amount=tokens}) contractHash txSkeleton
    >>= mint tokens contractHash
    >>= lockToPubKey ({asset=contractHash;amount=tokens}) pk in

ET.retT txSkeleton
