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
import { postRedeemCrowdsaleTokens } from '../../services/api-service'

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
    postRedeemCrowdsaleTokens()
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
          <h1>ZEN​ ​PROTOCOL​ ​SOFTWARE​ ​LICENSE</h1>
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
