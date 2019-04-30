/* eslint-disable react/no-unescaped-entities,max-len,no-irregular-whitespace */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import Checkbox from 'rc-checkbox'
import { observer, inject } from 'mobx-react'

import ErrorReportingStore from '../../stores/errorReportingStore'
import OnBoardingLayout from '../Layout/Layout'
import history from '../../services/history'
import routes from '../../constants/routes'

type Props = {
  errorReportingStore: ErrorReportingStore
};

@inject('errorReportingStore')
@observer
class TermsOfService extends Component<Props> {
  state = {
    checked: false,
  }

  onChange = (evt) => {
    this.setState({ checked: evt.target.checked })
  }

  onNext = () => {
    const { errorReportingStore } = this.props
    const nextPage = errorReportingStore.isReporting ?
      '/portfolio' :
      '/error-reporting-opt-in'
    history.push(nextPage)
  }

  render() {
    const { checked } = this.state

    return (
      <OnBoardingLayout className="terms-of-service-container" progressStep={5}>
        <h1>Terms and Conditions</h1>
        <h3>Please carefully read these terms before accepting.</h3>
        <div className="devider after-title" />

        <div className="terms-of-service-content">
          <h1> Zen Authorized Protocol </h1>
          <h2> Preamble </h2>
          <p>
            This document defines the Zen authorized protocol (the “​Authorized Protocol​”), including conditions that ​users must meet
            in order to use the Licensed Software pursuant to the ​Software License​. For the avoidance of doubt, nothing other than
            the Software License grants you permission to use, propagate or modify the Licensed Software, and the Authorized Protocol
            sets additional conditions that must be met ​in order to use the Licensed Software in compliance with the Software License.
            You are not required to accept the Authorized Protocol; however, failure to accept and act in accordance with the
            Authorized Protocol terminates your right to use the Licensed Software. Use of the Licensed Software in contravention of
            either the Authorized Protocol or the Software License is considered a breach of the Software License and copyright
            infringement.
          </p>
          <p>
            You may not modify the Authorized Protocol or the Licensed Software except as expressly provided under the Authorized Protocol.
            Any attempt otherwise to modify the Authorized Protocol or the Licensed Software is considered a breach of the Software License,
            automatically terminates your right to use the Licensed Software and is copyright infringement.
          </p>
          <p>
            By using the Licensed Software, you indicate your acceptance of the Authorized Protocol and Software License.
          </p>
          <p>
            All service providers or developers who produce tools to facilitate the construction and signing of smart contracts or
            transactions on behalf of other Zen Token holders must present this Authorized Protocol document and other referenced
            agreements. Service providers and developers shall be liable for losses resulting from failure to disclose the full terms to users.
          </p>
          <p>
            Terms used herein but not otherwise defined have the meanings assigned to them in the Software License.
          </p>
          <p>
            Up until now you have had access to software due to paying money as described in the Software License.
            This document supplements the old one as part of the community release.
          </p>
          <p>
            This software is in the copyright of Zen Protocol LTD (Owned by Blockchain Development LTD). While the company is not waiving its
            rights or IP in the software, it is granting some rights and opening it up to anyone who respects the following rules.
            In other words, the company waives its ability to censor, limit, revoke, etc any use of the system so long as you follow the rules.
          </p>
          <ol type="I" className="list-of-terms">
            <h2> <span className="bold">ARTICLE I</span> </h2>
            <h2> <span className="bold">AUTHORIZED PROTOCOL</span> </h2>
            <ul>
              <li>
                <span >Section 1.01 Authorized Protocol​.</span> The Authorized Protocol is the set of rules and processes by which blocks
                are added to the CommunityRelease Blockchain in a manner that the Community Release does, always linked to the Genesis Block.
                The Authorized Protocol includes the version of the Licensed Software that accepts those blocks and transactions that the
                Community Release accepts and rejects those blocks and transactions which the Community Release rejects.
              </li>
              <li>
                <span >Section 1.02 Community Release​.</span> The Community Release is ​the later of (i) the first protocol client compiled
                from the code with git commit/tag identifier [37ce6b3f626137b09147849b146716fbf5ad4872] released on June 30, 2018
                (also known as “​Malkuth​”), and (ii) any subsequent version of code that is approved by Community Vote.
                The Community Release shall always tie back to the Genesis Block.
              </li>
              <li>
                <span> Section 1.03 Genesis Block​. </span> The double SHA-3 Hash of the Genesis Block that initiates the Community Release
                Blockchain (the block with block number 1 accepted by the Community Release), dated June 30th, 2018, is attached in ​Appendix A​ below.
              </li>
              <li>
                <span >Section 1.04 Initial Circulating Supply; Increase in Supply​.</span> The Initial Circulating Supply of Zen Tokens
                (i.e., those Zen Tokens that have been issued on the Community Release Blockchain) is 20% of the total number of Zen Tokens to be issued.
                Generally, additional Zen Tokens shall be generated according to the following approximate sexennial schedule:
                <ol type="a">
                  <li> Over the six years following the Community Release Date, 40% of the total number of Zen Tokens to be issued shall be issued; </li>
                  <li> Over the following six years, an additional 20% of the total number of Zen Tokens to be issued shall be issued; </li>
                  <li> Over the third sexennial period, an additional 10% of the total number of Zen Tokens to be issued shall be issued; </li>
                  <li> For each successive sexennial period thereafter, half as great a percentage as was applied in the preceding period shall be applied. </li>
                </ol>
              </li>
            </ul>
            <h2> <span className="bold">ARTICLE II</span> </h2>
            <h2> <span className="bold">SOCIAL CONSENSUS</span> </h2>
            <ol>
              <li>
                <span >Section 2.01 Community​.</span> Miners neither govern nor determine the overall development of the project. Rather,
                the rules are made by the community of Zen Token holders. To this end, Article II provides rules for decentralized governance
                in using the Licensed Software. The following principles underpin this document:
                <ol type="a">
                  <li> Decisions shall not be determined on the basis of ‘one CPU one vote’ or any other hashpower mechanism. </li>
                  <li> Decisions shall not be made by possession or control of any single code repository. </li>
                  <li> Decisions shall not be made by hard forks or soft forks. </li>
                  <li> Decisions shall not be made by blackmail, rants on social media, intimidation or any other coercive means.</li>
                  <li> Rather, decisions shall be made by a vote of tokens.</li>
                </ol>
              </li>
              <li>
                <span >Section 2.02 Changes to the Authorized Protocol​.</span> At any time, an affirmative majority vote (50% plus one Zen Token)
                of the total number of Zen Tokens that have been issued on the Community Release Blockchain (such issued total, the “​Existing Tokens​”)
                can authorize a change to the Authorized Protocol. Each Zen Token entitles the owner to one vote. For the avoidance of doubt,
                Zen Tokens that have not yet been generated are not included in calculating the total of Existing Tokens. In addition, a change to
                the Authorized Protocol is not necessarily a change to the underlying Licensed Software. Prior to being voted on for adoption,
                any proposed change to the Authorized Protocol must first be determined to be eligible for such a vote in the first place.
                The procedure for this is set forth in Section 2.03(c). Votes are tallied in accordance with the procedures described in Section 2.04(d).
                The following is a non-exhaustive list of items that require a majority vote (50% plus one Zen Token) of Existing Tokens:
                <ol type="i">
                  <li> a change of the number of proposals that can be adopted per scheduled six month Community Vote. Currently, all eligible
                    proposals are voted on, but only one proposal will be adopted, regardless of differences in the types of changes each proposal
                    puts forth. Votes are consolidated into a single vote. ​For example​: proposals for a change in block size and a change in
                    the mining algorithm, are all considered and voted on against one another in zero-sum fashion; only one proposal will be adopted);
                  </li>
                  <li> a change of the requirement that all new Community Release code to have a hard stop to be a valid candidate for a vote (Section 2.03(c)(iii); </li>
                  <li> a change of maximum 100 million total supply of Zen Tokens to be generated (Section 1.04); </li>
                  <li> a change of Zen Token supply curve (Section 1.04);</li>
                  <li> a change of the genesis block necessary for the authorized protocol; or</li>
                  <li> a change to the voting threshold requirements.</li>
                </ol>
              </li>
              <ol type="a">
                <li>
                  <span>Changes to Community Release​.</span> If a majority (50% of Tokens voted plus one Zen Token) of votes cast (but not necessarily a majority
                  of Existing Tokens) support a new Community Release, such version shall be the next version of the Community Release (as of the date determined
                  in the Community Vote); provided, however, that such new Community Release does not contravene the Authorized Protocol. A change to the Community
                  Release that contravenes the Authorized Protocol is considered a breach of the Software License, automatically terminates your right to
                  use the Software License Software and may be considered copyright infringement. For the sake of clarity, in order to effect a change to the
                  Community Release that would require a change to the Authorized Protocol (i.e. because such new Community Release contravenes the Authorized Protocol
                  in place at the time), the voting requirements in Section 2.02 must first be followed to authorize the necessary change to the Authorized Protocol.
                  That is, in advance of the scheduled semiannual Community Vote, the user can initiate an unscheduled vote on a proposal to change the Authorized Protocol
                  pursuant to Section 2.02. Prior to being voted on for adoption, any proposed changes to the Authorized Protocol must first be determined to
                  be eligible for such a vote, as set forth in Section 2.03(c). Votes are tallied in accordance with the procedures described in Section 2.04(d).
                </li>
                <li>
                  <span>No Majority </span> If no Community Release proposal is approved by a majority of votes cast in a Community Vote, a “runoff” Community Vote
                  shall occur, in which the two proposals that received the highest number of affirmative votes cast in the original Community Vote shall be voted on.
                  If a majority (50% of Tokens voted plus one Zen Token) of votes cast in the runoff support a new Community Release proposal, such version shall be
                  the next version of the Community Release (as of the date determined in the Community Vote).
                </li>
                <li>
                  <span>Community Release Proposal Requirements​ </span> n order to be eligible for a vote, a proposal for a new Community Release must:
                  <ol type="i">
                    <li>
                      be on an actual implementation with publicly available code;
                    </li>
                    <li>
                      have a blockchain which accepts the initial Genesis Block and the blocks later derived from it based on the ‘legitimate’ technical
                      consensus mechanism as agreed on in the previous vote (i.e., the longest chain). ​For example​: in the period of time between the
                      Genesis Block and the first Community Vote the legitimate mechanism is SHA-3 proof-of-work. If there is a change in proof-of-work
                      based on the vote that occurs in 6 months (EG to SHA-256) than between interval 1 and interval 2the legitimate mechanism is Sha 256.
                      Therefore the Authorised protocol at the end of 1 year should contain roughly 64,800 blocks of SHA-256 preceded by 64,800 blocks of
                      SHA-3 that terminate/originate with genesis block X;
                    </li>
                    <li>
                      implement a stop every 7 months blocks. Malkuth (version one of the Community Release) has a stop after 7 months. Version two is
                      elected by the community, but must include a hard stop 7 months later, unless a majority of 50% plus one Zen Token of Existing
                      Tokens votes otherwise;
                    </li>
                    <li>
                      include a readme document in the ‘git commit’ (see Section 2.05) explaining the changes in the proposed version of the Community Release.
                      The description of the updates must discuss the material changes and differences, as well as the people responsible for developing
                      and implementing the proposed version.
                    </li>
                  </ol>
                </li>
                <li>
                  <span>Determining Proposals Eligible for a Vote​.</span> In both the scheduled semiannual Community Votes and the unscheduled votes,
                  in order for a proposed Community Release version and/or potential upgrade to the Authorized Protocol to be eligible for a Community Vote,
                  such proposals must first be approved by a vote of 3% of ​the total Existing Tokens. Such proposals must be submitted by sending a message
                  signed with a public key associated with a Zen balance to Authorized Nodes by initiating a transaction to the voting smart contract.
                  The transaction message shall include a smart contract with Zen Tokens information clearly indicating the proposal that you wish to be
                  voted on, in the form of plain text or a hash of the git commit and URL of the repository. As mentioned in 2.03(c)(iv), in the case of
                  Community Release proposals, the message must include a readme document describing the changes and team responsible. Messages that do
                  not reasonably communicate a clear voting preference shall not be counted. If a proposal did not obtain the aforementioned vote of approval
                  3% of Existing Tokens, any vote on such ineligible proposal in a Community Vote shall be ignored, and the user will not be able to vote on
                  another proposal during such Community Vote. Proposals relating to votes to change the Authorized outside of the semiannual Community Vote must first be
                  determined to be eligible for a vote as set forth in this Section 2.03(c) no less than 30 days prior to the actual Section 2.02 vote.
                  Votes are tallied in accordance with the procedures described in Section 2.04(d).
                </li>
                <li>
                  No Proposals​. If no upgrades to the Community Release are proposed for a given Community Vote Date, a “default upgrade” will occur in which
                  the block version number is incremented by one, the stop date is increased by 7 months, and nothing else changes.
                </li>
                <li>
                  No Quorum Requirement​. For the avoidance of doubt, no quorum (whether of Tokens or Token holders) shall be required for a Community Vote.
                </li>
              </ol>
              <li>
                <span>Section 2.04 Mechanism for Proposal Submission and Voting​.</span> Users control the development of the Licensed Software by voting on both the
                technical changes, and the people responsible for implementing and maintaining those changes. Using the Authorized Node software, users can submit a
                proposal to be voted on by sending a message signed with a public key associated with a Zen balance to Authorized Nodes by initiating a transaction to
                the voting smart contract. Similarly, using the Authorized Node software, users can vote on a proposal by sending a message signed with a public key associated
                with a Zen balance to Authorized Nodes by initiating a transaction to the voting smart contract. The transaction message shall include a smart contract with
                information clearly and unambiguously indicating your vote or the proposal that you wish to be voted on, as the case may be, in the form of plain text or a hash
                of git commit and URL of the repository being voted on or proposed to be voted on pursuant to 2.03(d). As mentioned in 2.03(c)(iv), in the case of Community Release
                proposals, the message must include a readme document describing the changes and team responsible
                <span className="bold"> Messages that do not reasonably communicate a clear voting preference shall not be counted​.</span>
                <ol type="a">
                  <li> <span>One Vote per Period​. </span> All eligible proposals are voted on, but only one proposal will be adopted, regardless of differences in the types of changes each
                    proposal puts forth. Votes are consolidated into a single vote. For example: proposals for changes in block size, hashing algorithm, reward size are all
                    considered and voted on against one another in zero-sum fashion; only one proposal will be adopted.
                  </li>
                  <li>
                    <span>Voting Schedule​.</span> The following timeline summarizes the process for the voting provisions discussed herein.
                    <ol type="i">
                      <li>
                        Votes shall occur every six months, beginning with six months from the Malkuth release date.
                      </li>
                      <li> In weeks 17-18, Community Release proposals must be disclosed publicly, and the community will determine which proposals are eligible to be voted on
                        (via the 3% eligibility vote set forth in Section 2.03(d).
                      </li>
                      <li>
                        In weeks 19-20, the community shall vote on those Community Release proposals that received more than 3% or more in the Section 2.03(d) eligibility voting.
                      </li>
                      <li>
                        In weeks 21-22, the community shall tally the votes and determine the integrity of the votes.
                      </li>
                      <li>
                        In the event that no Community Release Proposal received an affirmative majority of votes, the community shall conduct a runoff vote in weeks 23-24.
                      </li>
                      <li>
                        In weeks week 25-26, users download the voted on Community Release that won the vote and upgrades to version as the new Community Release.
                      </li>
                      <li>
                        After week 26, there is an upgrade to this next version.
                      </li>
                    </ol>
                  </li>
                  <li> Tallying Votes​. After each voting period closes, votes are tallied in
                    c.
                    a distributed fashion: users must collect and count the publicly voting information available on the Authorized Nodes. Users should then publish the results of
                    their tallies by broadcasting such information to the Authorized Nodes in the form of a transaction message. Tokens may not be voted more than once. Messages that
                    do not reasonably communicate a clear voting preference shall not be counted.
                  </li>
                </ol>
                <li>
                  <span >Section 2.05 Adherence to Additional Principles​. </span> Proposed upgrades to the Community Release and/or Authorized Protocol must preserve:
                  <ol type="i">
                    <li>
                      the backward and forward compatibility described in Section 1.01;
                    </li>
                    <li>
                      the Circulating Supply Schedule set forth in Section 1.04;
                    </li>
                    <li>
                      the ability of Token holders to vote on future proposed upgrades to the Authorized Protocol and Community Release; and
                    </li>
                    <li> in the case of Community Release upgrades, a six month expiry of such new version.</li>
                  </ol>
                </li>
                <li>
                  <span >Section 2.06 No Contentious Forks​.</span> Other than pursuant to the conditions and procedures as described in this document,
                  “Hard Forks” are not an acceptable consensus mechanism. Each community member has the right to keep his or her Zen Tokens whole and not
                  split, which may diminish the value of the Zen Tokens.
                </li>
                <li>
                  <span >Section 2.07 Initial Reserved Powers.</span> Notwithstanding the other provisions of this Authorized Protocol, Blockchain Development LTD
                  and its principals may, until July 1st 2020, issue such updates as are, in their judgement, necessary and advisable for the continued
                  reliable operation of the Zen Protocol blockchain. Such updates may be made in addition to any passed via the other mechanisms permitted
                  by this Authorized Protocol.
                </li>
              </li>
            </ol>
          </ol>
          <h2> END OF AUTHORIZED PROTOCOL </h2>
          <p> The double SHA-3 hash of the Genesis Block has the hexadecimal encoding 57b925330faf7d08f1d9799147258bf8fbb6bfea63795c5162221766321215c6​. </p>
          <div>
            <h2><span className="bold" >ZEN​ ​PROTOCOL​ ​SOFTWARE​ ​LICENSE</span></h2>
            <p>
              This Zen Protocol Software License (this <span className="bold">"Agreement"​</span>) governs Your use of the
              computer software (including wallet, miner, tools, compilers, documentation, examples, source
              code and other files) as may be made available by <span className="bold">Zen Protocol Ltd​</span>, a Seychelles company
              <span className="bold">(“Licensor”​)</span> via GitHub at https://github.com/zenprotocol/zen-wallet or from any other
              distribution source authorized by Licensor from time to time (together with the authorized
              Community Releases defined below, the <span className="bold">“Licensed Software”​</span>). References herein to “You” or
              “Your” means each person that installs, executes, accesses, stores, copies, modifies (to the extent
              permitted in this Agreement), distributes or otherwise makes use of the Licensed Software (each
              a “Use”​). You are only authorized to Use the Licensed Software if You agree fully comply with
              the terms and conditions of this Agreement. Otherwise, if you do not agree to the terms and
              conditions of this Agreement, You may not Use the Licensed Software in any manner, and You
              should in that case immediately delete any copies of the Licensed Software that You may have
              made.
            </p>
            <p>
              You acknowledge and agree that (A) Licensor has spent considerable time, effort and
              resources in the development of the Licensed Software, and that the Licensed Software contains
              valuable intellectual property rights owned by the Licensor, and (B) Your right to Use the
              Licensed Software (as set forth and limited by this Agreement) constitutes good and valuable
              consideration exchanged for Your agreement to the terms and conditions herein and the
              consideration paid for the Purchased Tokens.
            </p>
            <p>You therefore further agree as follows:</p>

            <ol type="I" className="list-of-terms">

              <li className="definitions" >
                <span>
                  <u>Definitions.</u> The following terms when used with initial capital letters shall have the meanings stated below:
                </span>

                <ol type="a">
                  <li>
                    <span className="bold">“Authorized Nodes​”</span> means the collection of all installed instances of the
                    executable portions of the Licensed Software, where each such instance is connected to
                    all other such instances via direct or indirect peer-to-peer network connections.
                  </li>
                  <li>
                    <span className="bold">“Authorized Protocol​”</span> means the rules, data structures, programming
                    language, scripts, cryptographic signing methods, and communication protocols solely as
                    specified and defined by Licensor from time to time, that provide the sole mechanism for
                    the addition of new transactions and contracts to the applicable Blockchain, verification
                    of such additions, and achieving consensus among Authorized Nodes regarding the
                    validity and immutability of such Blockchain; provided that, after the Community
                    Release Date, the Authorized Protocol shall mean such version of the Authorized
                    Protocol in effect on the Community Release Date, or as applicable any amendment
                    thereafter made by the required consensus of Authorized Nodes (determined in
                    accordance with the Authorized Protocol in effect immediately prior to such amendment).
                  </li>
                  <li>
                    <span className="bold">“Blockchain​”</span> means the distributed, public, digital ledger containing
                    records (blocks) evidencing transactions and contracts, structured and signed via digital
                    encrypted signatures in accordance with the Authorized Protocol, which blocks are
                    formed, confirmed by consensus, and extended solely by Authorized Nodes running the
                    Licensed Software in accordance with the Authorized Protocol.
                  </li>
                  <li>
                    <span className="bold">“Community Release​”</span> means a future version of the Licensed Software
                    designated by Licensor as the “Community Release Version 1.0,” together with any
                    permitted modification of such Licensed Software developed and distributed in
                    compliance with the terms of this Agreement by Licensor, You or any other person.
                    Licensor will use good faith efforts to make the Community Release available to You by
                    June 30, 2018.
                  </li>
                  <li>
                    <span className="bold">“Community Release Blockchain​”</span> means a new Blockchain that will be
                    initiated with a new genesis block on the Community Release Date, and that will
                    continue from and after the Community Release Date.
                  </li>
                  <li>
                    <span className="bold">“Community Release Date​”</span> means the date that Licensor makes the first
                    Community Release version available to You.
                  </li>
                  <li>
                    <span className="bold">“Initial Blockchain​”</span> means the initial Blockchain prior to the Community
                    Release Date that shall terminate on the Community Release Date.
                  </li>
                  <li>
                    <span className="bold">“Purchased Tokens​”</span> means Tokens that You purchase directly from the
                    Licensor prior to the Community Release Date.
                  </li>
                  <li>
                    <span className="bold">“Token​”</span> means a data packet, structured and signed via digital encrypted
                    signatures in accordance with the Authorized Protocol, which data packet is included in
                    the applicable Blockchain and transferable via the applicable Blockchain in accordance
                    with the Authorized Protocol. A “Token” is “contained” in a Wallet if such Token is
                    registered on the Blockchain to a public key or keys contained in such Wallet determined
                    in accordance with the Authorized Protocol.
                  </li>
                  <li>
                    <span className="bold">“Wallet​”</span> means the executable portion of the Licensed Software that
                    includes generated private and public cryptographic keys used for signing and encrypting
                    transactions and contracts on the applicable Blockchain, together with the unique set of
                    private and public keys associated with Your Use. Multiple installed instances of such
                    Licensed Software associated with the same private and public keys are a single “Wallet”
                    for purposes of this Agreement.
                  </li>
                </ol>
              </li>

              <li className="user-and-restrictions">
                <u>Use and Restrictions.</u>

                <ol type="a">
                  <li>
                    <u>Grant of License.</u> Conditioned upon Your compliance with <span className="bold">Section 2, 3</span>
                    and <span className="bold">4</span> of this Agreement, Licensor grants to You a limited, non-exclusive, personal,
                    non-transferable right and license to Use any number of instances of the Licensed
                    Software solely in connection with Your operation of Authorized Nodes and Your Wallet
                    in connection with the applicable Blockchain. You shall include, and shall under no
                    circumstances remove, Licensor’s and its licensors' copyright, trademark, service mark,
                    and other proprietary notices on any complete or partial copies of the Licensed Software
                    in the same form and location as the notice appears on the original work. A copy of this
                    Agreement shall be included with each copy of the Licensed Software or portion of the
                    Licensed Software that you make.
                  </li>
                  <li>
                    <u>Restrictions; Reservation of Rights.</u> Customer shall not use the Licensed
                    Software for any purpose other than as expressly set forth in this Agreement. Except as
                    expressly permitted under <span className="bold">Section 4</span> ​with respect to the Community Release only, ​You
                    shall not modify or create derivatives of, translate, reverse engineer, disassemble, reverse
                    compile, de-compile or otherwise attempt to determine the functionality of the Licensed
                    Software (except, in each case, only to the extent as may be permitted by law), or for any
                    reason attempt to ascertain, derive and/or appropriate the source code except for source
                    code that is included in the Licensed Software as provided to You by Licensor. In the
                    event that You create any modifications or derivatives of the Licensed Software, whether
                    or not authorized, You hereby assign, and agree to assign and to cause any of Your
                    employees or contractors to assign, such modifications and derivatives of the Licensed
                    Software to Licensor, and to do all things necessary to establish and perfect Licensor’s
                    ownership and rights in same. Prior to the Community Release Date, You shall not
                    resell, redistribute or otherwise make the Licensed Software (including the copy
                    furnished to You by Licensor) available to any third party. You acknowledge and agree
                    that the rights granted hereunder are not a sale of the Licensed Software (including the
                    copy furnished to You by Licensor) and that You shall destroy all copies (in whatever
                    form or media) of the Licensed Software upon expiration or termination of this
                    Agreement for any reason, except that you may retain an archival copy of Your private
                    and public keys contained in Your Wallet. No express or implied rights or licenses are
                    granted herein, except as expressly granted in this <span className="bold">Section 2​</span>, and Licensor reserves all
                    title and all other rights to the Licensed Software (including all copies thereof, in
                    whatever form or media) including all intellectual property rights therein.
                  </li>
                  <li>
                    <u>Lawful Use.</u> You acknowledge and agree that Your Use of the Licensed
                    Software, the Blockchain and Tokens may be subject to regulation in certain
                    jurisdictions, and some Uses may be prohibited in certain jurisdictions. You are solely
                    responsible for Your Use of the Licensed Software, and You shall ensure that Your Use
                    of the Licensed Software is in compliance with all laws, regulations and orders applicable
                    to You.
                  </li>
                </ol>
              </li>

              <li className="initial-term">
                <span><u>Initial Term.</u> Prior to the Community Release Date:</span>
                <ol type="a">
                  <li>
                    <u>Purchased Tokens.</u> Tokens are required to use the Licensed Software
                    prior to the Community Release Date, and functionality of the Licensed Software will be
                    restricted until you acquire at least one Purchased Token. You must purchase at least one
                    Purchased Token from Licensor prior to the Community Release Date in order to Use the
                    Licensed Software in connection with the Initial Blockchain. You may purchase
                    additional Purchased Tokens for the purpose of using multiple Wallets, or to create, enter
                    into, and execute contracts and transactions on the Initial Blockchain with other users of
                    the Licensed Software in accordance with the Authorized Protocol. Licensor shall
                    transfer Your Purchased Tokens to a public address in Your Wallet that You provide to
                    Licensor at the time of purchase. You are solely responsible for designating and
                    providing to Licensor a valid and correct public address from Your Wallet, and
                    understand that providing an incorrect or invalid public address may result in permanent
                    loss of Your Purchased Token, and no refund shall be provided in such case.
                  </li>
                  <li>
                    <u>Licensed Software Activation.</u> The Licensed Software is licensed, not
                    sold. Each Purchased Token that you acquire shall provide to You the license right to
                    activate one Wallet for Use with the Licensed Software. You may, however, download
                    and install one copy of the Licensed Software prior to acquiring a Purchased Token for
                    the sole purpose of acquiring a Purchased Token to be contained in Your Wallet.
                  </li>
                  <li>
                    <u>Token Transfer and Reset.</u> You may transfer a Token contained in Your
                    Wallet via the Initial Blockchain solely through Use of the Licensed Software, so long as
                    you maintain at least one Token in Your Wallet. You acknowledge and agree, however,
                    that any such transfer of Tokens occurring on the Initial Blockchain shall be disregarded
                    from and after the Community Release Date.
                  </li>
                </ol>
              </li>

              <li className="community-release">
                <span><u>Community Release.</u> From and after the Community Release Date:</span>
                <ol type="a">
                  <li>
                    You shall only Use a Community Release version of the Licensed
                    Software and shall cease Use of any and all prior versions or releases.
                  </li>
                  <li>
                    Licensor shall transfer any Purchased Tokens that you purchased from
                    Licensor to to a public address in Your Wallet using the Community Release version of
                    the Licensed Software. Any Tokens that You may have acquired through transfers or
                    mining on the Initial Blockchain will be disregarded. You are solely responsible for
                    designating and providing to Licensor a valid and correct public address from Your
                    Wallet using the Community Release version of the Licensed Software promptly after the
                    Community Release Date, and understand that providing an incorrect or invalid public
                    address may result in permanent loss of Your Purchased Token, and no refund shall be
                    provided in such case.
                  </li>
                  <li>
                    You may distribute a Community Release version of the Licensed
                    Software to any other person, provided that You shall (i) only distribute a complete copy
                    of the Licensed Software (including source code) as provided to You by Licensor (or
                    another party if You obtained the Licensed Software from another source), (ii) include a
                    copy of this Agreement with any such distribution, (iii) include in unmodified form
                    Licensor’s and its licensors' copyright, trademark, service mark, and other proprietary
                    notices on any such distribution of the Licensed Software in the same form and location
                    as the notice appears on the original work, (iv) only distribute the Licensed Software
                    under the terms and conditions of this Agreement without any additional or different
                    terms and conditions, and (v) shall not require any fee, payment, royalty or other
                    consideration for any distribution or transfer of the Licensed Software.
                  </li>
                  <li>
                    You shall only Use a Community Release version of the Licensed
                    Software that fully complies (to the best of Your knowledge) with: (i) the latest version
                    of the Authorized Protocol published by Licensor and in effect as of the Community
                    Release Date, or as applicable (ii) the then current amended version of the Authorized
                    Protocol if such Authorized Protocol has been amended by the required consensus of
                    Authorized Nodes (determined in accordance with the Authorized Protocol in effect
                    immediately prior to such amendment).
                  </li>
                  <li>
                    Subject to Your compliance with this Section 4(e), You may modify the
                    Community Version of the Licensed Software solely for the purposes of: (i) improving
                    the Licensed Software only for use with the Community Release Blockchain in a manner
                    that fully complies with the then current Authorized Protocol, or (ii) developing a test
                    version of Licensed Software for testing Use in connection with a good faith proposal by
                    You or another person to modify the Authorized Protocol; provided in each case,
                    however, that You agree that any such modified version of the Licensed Software shall
                    be subject to this Agreement and shall only be distributed by You to any other person
                    subject to this Agreement (and no other agreement). You shall distribute a complete
                    copy of the source code for any such modified version of the Licensed Software together
                    with Your distribution of such modified Licensed Software, and shall include a copy of
                    this Agreement with any such distribution. You shall not impose any additional or
                    different terms or conditions in connection with any such modified version of the
                    Licensed Software. You acknowledge and agree that any modifications of the Licensed
                    Software that You develop shall be owned by the Licensor and shall be deemed part of
                    the Licensed Software under this Agreement. If You modify the Licensed Software, You
                    represent and warrant to Licensor and to each person who directly or indirectly receives a
                    copy of Your modified version of the Licensed Software that such modified version of
                    the Licensed Software is not subject to any patent or other intellectual property rights that
                    may impose any royalty or payment obligation or otherwise restrict or condition the
                    rights of Licensor or such persons under this Agreement with respect to such modified
                    Licensed Software. If You do not agree with or cannot comply with the foregoing terms
                    and conditions regarding modification of the Licensed Software, then You may not make
                    or distribute any modifications to the Licensed Software.
                  </li>
                  <li>
                    You may Use a test version of the Licensed Software (that does not
                    comply with the then current Authorized Protocol or that You are testing to confirm
                    compliance with such Authorized Protocol) that You or any other person develops in
                    accordance with this Agreement solely in a test environment for non-commercial and
                    non-production development and testing purposes with a copy of the Blockchain, and not
                    in connection with the then current Community Release Blockchain.
                  </li>
                </ol>
              </li>

              <li className="term-and-termination">
                <span><u>Term and Termination.</u></span>
                <ol type="a">
                  <li>
                    <u>Termination for Breach.</u> Licensor may terminate Your rights under this
                    Agreement in the event that You fail to comply with any term or condition of this
                    Agreement, including the breach of any representation or warranty or failure to perform
                    any condition or obligation required under this Agreement, and if You fail to cure the
                    breach to Licensor’s satisfaction within fifteen (15) days of receipt by You of written or
                    e-mail notice thereof. If Licensor terminates Your rights under this Agreement, You
                    shall thereafter cease all Use of the Licensed Software (including any Community
                    Release, whether or not obtained from Licensor). You acknowledge and agree that notice
                    hereunder may be provided Licensor by sending notice to the e-mail address that You
                    provide to Licensor in connection with Your purchased of any Purchased Token, or by
                    any other lawful and reasonable method of notice.
                  </li>
                  <li>
                    <u>Survival.</u> Sections 6, 7, 8 and 9​, shall survive expiration or termination of this Agreement for any reason.
                  </li>
                </ol>
              </li>

              <li className="no-promotion">
                <u>No Promotion.</u> You shall not, without the prior written consent of Licensor, use
                in advertising, publicity, or otherwise, the name of Licensor or any officer, director, employee,
                consultant or agent of Licensor, nor any trade name, trademark, trade device, service mark,
                symbol or any abbreviation, contraction or simulation thereof owned by either of the foregoing.
              </li>

              <li className="disclaimer">
                <span><u>Disclaimer of Warranties; Limitation of Liability.</u></span>
                <ol type="a">
                  <li>
                    <u>Limitation on Rights Subject to Claim of Infringement.</u> If the Licensed
                    Software becomes subject to a claim of infringement, Licensor may at its sole option (x)
                    obtain the right for You to continue using the Licensed Software; (y) replace or modify
                    the Licensed Software such that it does not infringe, and terminate Your rights under this
                    Agreement with respect to such prior version; or (z) terminate this Agreement if
                    Licensor. EXCEPT FOR THE REMEDIES SET FORTH IN THIS SECTION 7,
                    LICENSOR SHALL HAVE NO LIABILITY TO YOU FOR INTELLECTUAL
                    PROPERTY RIGHTS INFRINGEMENT, AND SHALL IN NO INSTANCE HAVE
                    ANY LIABILITY TO YOU FOR ANY SPECIAL, INDIRECT, INCIDENTAL OR
                    CONSEQUENTIAL DAMAGES RELATED TO ANY INFRINGEMENT.
                  </li>
                  <li>
                    <u>Disclaimer of Warranties.</u> THE LICENSED SOFTWARE IS PROVIDED
                    ON AN "AS IS" AND "AS AVAILABLE" BASIS. NEITHER LICENSOR NOR ITS
                    THIRD PARTY LICENSORS MAKE ANY WARRANTIES, EXPRESS OR IMPLIED,
                    REGARDING THE CORRECTNESS, QUALITY, ACCURACY, SECURITY,
                    COMPLETENESS, RELIABILITY, PERFORMANCE, TIMELINESS, PRICING OR
                    CONTINUED AVAILABILITY OF THE LICENSED SOFTWARE OR THE FAILURE
                    OF ANY CONNECTION OR COMMUNICATION SERVICE TO PROVIDE OR
                    MAINTAIN ACCESS TO THE LICENSED SOFTWARE. LICENSOR
                    SPECIFICALLY DISCLAIMS ALL EXPRESS OR IMPLIED WARRANTIES OF
                    NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS FOR A
                    PARTICULAR PURPOSE, OPERATION OF THE LICENSED SOFTWARE AND
                    ANY PARTICULAR APPLICATION OR USE OF THE LICENSED SOFTWARE
                    (WHETHER OR NOT KNOWN).
                  </li>
                  <li>
                    <u>Limitation of Liability.</u> YOUR SOLE REMEDY AND THE
                    LICENSOR’S SOLE OBLIGATION RELATING TO THIS AGREEMENT, THE
                    BLOCKCHAIN, TOKENS AND THE LICENSED SOFTWARE SHALL BE
                    GOVERNED EXCLUSIVELY BY THIS AGREEMENT AND IN NO EVENT SHALL
                    LICENSOR’S LIABILITY TO YOU THEREFORE EXCEED THE LESSER OF (X)
                    THE ACTUAL AMOUNTS PAID TO LICENSOR BY YOU FOR YOUR
                    PURCHASED TOKENS, AND (Y) ONE THOUSAND UNITED STATES DOLLARS
                    ($1,000). IN NO EVENT SHALL LICENSOR BE LIABLE FOR ANY SPECIAL,
                    INDIRECT, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING FROM
                    BREACH OF WARRANTY, BREACH OF CONTRACT, NEGLIGENCE, OR ANY
                    OTHER LEGAL OR EQUITABLE THEORY, WHETHER IN TORT OR CONTRACT,
                    EVEN IF LICENSOR IS AWARE OF THE LIKELIHOOD OF SUCH DAMAGES
                    OCCURRING, INCLUDING COMPENSATION, REIMBURSEMENT OR DAMAGES
                    ON ACCOUNT OF THE LOSS OF PRESENT OR PROSPECTIVE PROFITS,
                    EXPENDITURES, INVESTMENTS OR COMMITMENTS, WHETHER MADE IN
                    THE ESTABLISHMENT, DEVELOPMENT OR MAINTENANCE OF BUSINESS
                    REPUTATION OR GOODWILL, FOR LOSS OF DATA, COST OF SUBSTITUTE
                    PRODUCTS, COST OF CAPITAL, AND THE CLAIMS OF ANY THIRD PARTY, OR
                    FOR ANY OTHER REASON WHATSOEVER. Neither Licensor nor its licensors shall
                    be responsible for any damages or expenses resulting from version of the Licensed
                    Software that is provided by any other person, or from any unauthorized Use of the
                    Licensed Software or from any unintended or unforeseen results obtained by You
                    resulting from such Use.
                  </li>
                </ol>
              </li>

              <li className="title-to-licensed-software">
                <u>Title to Licensed Software.</u> Nothing contained in this Agreement shall directly or
                indirectly be construed to assign or grant to You any right, title or interest in and to the
                trademarks, copyrights, patents or trade secrets of Licensor or any ownership rights in or to the
                Licensed Software.
              </li>

              <li className="general">
                <span><u>General</u></span>

                <ol type="a">
                  <li>
                    <u>Entire Agreement.</u> This Agreement contains the entire agreement of the
                    Parties with respect to their subject matter and supersedes all existing and all other oral,
                    written or other communications between the Parties concerning this subject matter.
                  </li>
                  <li>
                    <u>Amendments.</u> This Agreement may not be modified, except by a writing signed by both Licensor and You.
                  </li>
                  <li>
                    <u>Assignment.</u> You may not assign the Agreement, in whole or in part. If
                    You are otherwise authorized under this Agreement to distribute the Licensed Software to
                    a third party, such third party shall take such License Software subject to a separate
                    Agreement between Licensor and such third party (and not by assignment). This
                    Agreement shall be binding upon and shall inure to the benefit of the parties hereto and
                    their respective successors.
                  </li>
                  <li>
                    <u>Equitable Relief.</u> You acknowledges that a breach of any provision of
                    <span className="bold">Section 2, 3</span> or <span className="bold">4</span> of this Agreement shall cause Licensor irreparable injury and damage.
                    Therefore, those breaches may be stopped through injunctive proceedings, without
                    posting of any bond, in addition to any other rights and remedies which may be available
                    to Licensor at law or in equity, and You will not urge that such remedy is not appropriate
                    under the circumstances.
                  </li>
                  <li>
                    <u>Severability.</u> If any provision of this Agreement (or any portion thereof)
                    is invalid, illegal or unenforceable, the validity, legality and enforceability of the
                    remainder of this Agreement shall not be affected or impaired.
                  </li>
                  <li>
                    <u>No Waiver.</u> The failure by Licensor to insist upon strict performance of
                    any of the provisions contained in this Agreement shall in no way constitute a waiver of
                    its rights as set forth in this Agreement, at law or in equity, or a waiver of any other
                    provisions or subsequent default by You in the performance or compliance with any of
                    the terms and conditions set forth in this Agreement.
                  </li>
                  <li>
                    <u>Construction.</u> The headings and captions in this Agreement are intended
                    for convenience of reference and shall not affect interpretation. The terms "include" or
                    "including" and “e.g.,” as used in this Agreement, shall be deemed to include the phrase
                    "without limitation."
                  </li>
                  <li>
                    <u>Governing Law.</u> This Agreement is deemed entered into in Seychelles,
                    and and any disputes hereunder shall be governed by and construed in accordance with
                    the laws of Seychelles, without giving effect to principles of conflict of law of any
                    jurisdiction. Excluding only claims of infringement of intellectual property rights
                    embodied in the Licensed Software (which claims may be brought in any court having
                    valid jurisdiction), the courts of Seychelles shall have exclusive venue and jurisdiction to
                    determine any disputes which may arise out of or in connection with this Agreement.
                    You consent to the personal jurisdiction of, and venue in, the courts within Seychelles
                    and hereby waive any objection to such jurisdiction and venue on any grounds, including
                    the convenience of the forum. Neither the United Nations Convention on Contracts for
                    the International Sale of Goods nor the Uniform Computer Information Transactions Act
                    as enacted shall apply to this Agreement.
                  </li>
                  <li>
                    <u>Export Control Notice.</u> The Licensed Software may be subject to United
                    States or foreign export control laws. You shall ensure that any exports from the United
                    States are in compliance with the U.S. export control laws. You agree that You will not
                    submit the Licensed Software to any government agency for licensing consideration or
                    other regulatory approval without the prior written consent of Licensor.
                  </li>
                </ol>
              </li>

            </ol>
          </div>
        </div>

        <div className="devider before-buttons" />

        <Flexbox flexDirection="row" className="terms-checkbox">
          <Flexbox flexGrow={1} flexDirection="row">
            <label className="checkbox">
              <Checkbox type="checkbox" checked={checked} onChange={this.onChange} />
              <span className="checkbox-text">
                &nbsp; I have read, understand and agree to the Terms and Conditions.
              </span>
            </label>
          </Flexbox>
          <Flexbox flexGrow={2} />
          <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
            <Link className="button secondary" to={routes.IMPORT_OR_CREATE_WALLET}>Back</Link>
            <button
              disabled={!checked}
              className="button-on-right"
              onClick={this.onNext}
            >
              Accept Terms
            </button>
          </Flexbox>
        </Flexbox>

      </OnBoardingLayout>
    )
  }
}

export default TermsOfService
