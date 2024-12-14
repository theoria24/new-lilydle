import { Clue } from "./clue";
import { Row, RowState } from "./Row";
import { maxGuesses } from "./util";

export function About() {
  return (
    <div className="App-about">
      <p>
        <i>アサルトリリィわーどる</i>
        は、単語当てゲーム
        <a href="https://www.powerlanguage.co.uk/wordle/">
          <i>Wordle</i>
        </a>
        のアサルトリリィ版（日本語）です。
        <a href="https://www.powerlanguage.co.uk/wordle/">
          <i>Wordle</i>
        </a>
        は、
        <a href="https://twitter.com/powerlanguish">powerlanguage</a>
        さんが作成したゲームで、これはそのリメイク版です。また、このゲームは、
        <a href="https://twitter.com/chordbug">Lynn</a>さんの作成した
        <a href="https://hellowordl.net">
          <i>Hello Wordl</i>
        </a>
        の<a href="https://github.com/skytomo221">skytomo</a>さんによるフォーク
        <a href="https://github.com/skytomo221/waadoru">
          <i>waadoru</i>
        </a>をフォークして使用しています。
        日本語へローカライズするために、オリジナルのゲームにいくつかのルールが加えられています。
      </p>
      <hr />
      <p>
        <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
          <img alt="Creative Commons License" style={{ borderWidth: 0 }} src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
        </a>
        <br />
        本サイトが辞書に利用するアサルトリリィ関連データは、
        <a href="https://github.com/Assault-Lily/LuciaDB">
          LuciaDB
        </a>
        によって
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ja">
          クリエイティブ・コモンズ 表示 - 非営利 - 継承 4.0 国際 ライセンス
        </a>
        のもとに提供されています。
      </p>
      <hr />
      <p>
        お題の単語は{maxGuesses}回以内に当てます。
        <br />
        単語を推測すると、それに対してヒントが与えられます。
      </p>
      <p>
        <h2>よくわかる五十音表</h2>
        <table className="kana-table">
          <th colSpan={17}>
            <b className="green-black-bg">　</b> ⬇️行の一致⬇️
          </th>
          <th></th>
          <tr>
            <th rowSpan={6} className="border-none"></th>
            <th rowSpan={5} className="border-none"></th>
            <th>ぱ</th>
            <th>ば</th>
            <th>だ</th>
            <th>ざ</th>
            <th>が</th>
            <th>わ</th>
            <th>ら</th>
            <th>やゃ</th>
            <th>ま</th>
            <th>は</th>
            <th>な</th>
            <th>た</th>
            <th>さ</th>
            <th>か</th>
            <th>あぁ</th>
            <th rowSpan={7}>
              ⬅️
              <br />段<br />の<br />一<br />致<br />
              ⬅️
              <br />
              <b className="black-green-bg">　</b>
            </th>
          </tr>
          <tr>
            <td>ぴ</td>
            <td>び</td>
            <td>ぢ</td>
            <td>じ</td>
            <td>ぎ</td>
            <td>ゐ</td>
            <td>り</td>
            <td></td>
            <td>み</td>
            <td>ひ</td>
            <td>に</td>
            <td>ち</td>
            <td>し</td>
            <td>き</td>
            <th>いぃ</th>
          </tr>
          <tr>
            <td>ぷ</td>
            <td>ぶ</td>
            <td>づ</td>
            <td>ず</td>
            <td>ぐ</td>
            <td></td>
            <td>る</td>
            <td>ゆゅ</td>
            <td>む</td>
            <td>ふ</td>
            <td>ぬ</td>
            <td>つっ</td>
            <td>す</td>
            <td>く</td>
            <th>うぅ</th>
          </tr>
          <tr>
            <td>ぺ</td>
            <td>べ</td>
            <td>で</td>
            <td>ぜ</td>
            <td>げ</td>
            <td>ゑ</td>
            <td>れ</td>
            <td></td>
            <td>め</td>
            <td>へ</td>
            <td>ね</td>
            <td>て</td>
            <td>せ</td>
            <td>け</td>
            <th>えぇ</th>
          </tr>
          <tr>
            <td>ぽ</td>
            <td>ぼ</td>
            <td>ど</td>
            <td>ぞ</td>
            <td>ご</td>
            <td>を</td>
            <td>ろ</td>
            <td>よょ</td>
            <td>も</td>
            <td>ほ</td>
            <td>の</td>
            <td>と</td>
            <td>そ</td>
            <td>こ</td>
            <th>おぉ</th>
          </tr>
          <tr>
            <th>ん</th>
            <td colSpan={15} className="border-none"></td>
          </tr>
          <tr>
            <th>ー</th>
            <td colSpan={16} className="border-none"></td>
          </tr>
        </table>
      </p>
      <p>本ゲームは、上の五十音表を使用します。</p>
      <p>
        行は基本的に子音が同じであることを示します。
        例えばか行は「か」「き」「く」「け」「こ」の5文字です。
        清音と濁音、半濁音は区別します。
      </p>
      <p>
        段は基本的に母音が同じであることを示します。
        例えばい段は「い」「き」「し」「ち」「に」「ひ」「み」「り」「ゐ」「ぎ」「じ」「ぢ」「び」「ぴ」です。
      </p>
      <p>
        「ん」と「ー」は他のどの行にも一致しません。
        また、他のどの段にも一致しません。
      </p>
      <hr />
      <h2>ルール</h2>
      <p>
        <b className="green-bg">　</b>（絵文字は🟩）は一致を表します。
      </p>
      <p>
        <b className="purple-bg">　</b>
        （絵文字は🟪）は清音、濁音、半濁音、小書き文字のどれかであることを表します。
      </p>
      <p>
        <b className="gray-bg">　</b>
        （絵文字は⬛）はお題の単語に含まれていないことを表します。
      </p>
      <p>
        <b className="green-gray-bg">　</b>
        （絵文字は🟦）は行が一致していることを表します。
      </p>
      <p>
        <b className="gray-green-bg">　</b>
        （絵文字は🟥）は段が一致していることを表します。
      </p>
      <p>
        <b className="yellow-bg">　</b>
        （絵文字は🟡）は他の場所にあることを表します。
      </p>
      <p>
        <b className="green-yellow-bg">　</b>
        （絵文字は🔵）は<b className="yellow-bg">　</b>と
        <b className="green-black-bg">　</b>
        の組み合わせを表します。
      </p>
      <p>
        <b className="yellow-green-bg">　</b>
        （絵文字は🔴）は<b className="yellow-bg">　</b>と
        <b className="black-green-bg">　</b>
        の組み合わせを表します。
      </p>
      <hr />
      <Row
        rowState={RowState.LockedIn}
        wordLength={7}
        cluedLetters={[
          { clue: Clue.Almost, letter: "し" },
          { clue: Clue.CorrectConsonant, letter: "ょ" },
          { clue: Clue.Correct, letter: "う" },
          { clue: Clue.CorrectVowelAndElsewhere, letter: "ち" },
          { clue: Clue.Absent, letter: "く" },
          { clue: Clue.CorrectVowel, letter: "ば" },
          { clue: Clue.Elsewhere, letter: "い" },
        ]}
      />
      <p>
        <b>く</b>はお題の単語に含まれていません。
      </p>
      <p>
        <b className="green-bg">う</b>は合っています！3文字目は
        <b className="green-bg">う</b>です。
        <br />
        <strong>
          （しかし、単語の中に「う」が2回以上現れることもあります。）
        </strong>
      </p>
      <p>
        <b className="purple-bg">し</b>はとても惜しいです。
        <br />
        1文字目は清音ではなく、
        <br />
        濁音か半濁音または小書き文字であることを示しています。
      </p>
      <p>
        <b className="yellow-bg">ー</b>はお題の単語の他の場所にあります。
        <br />
        <strong>（2回以上現れることもあります。🤔）</strong>
      </p>
      <p>
        <b className="gray-green-bg">ば</b>は、
        <b className="gray-bg">ば</b>と<b className="black-green-bg">ば</b>
        の組み合わせです。
        <br />
        <b className="black-green-bg">　</b>は段が一致していることを表します。
        <br />
        つまり「ば」はお題の単語に含まれていませんが、
        <br />
        6文字目はば行ではないあ段の文字です。
      </p>
      <p>
        <b className="green-gray-bg">ょ</b>は、
        <b className="gray-bg">ょ</b>と<b className="green-black-bg">ょ</b>
        の組み合わせです。
        <br />
        <b className="green-black-bg">　</b>は行が一致していることを表します。
        <br />
        つまり「ょ」はお題の単語に含まれていませんが、
        <br />
        2文字目はや行であるお段ではない文字です。
      </p>
      <p>
        <b className="green-yellow-bg">ち</b>は、
        <b className="yellow-bg">ち</b>と<b className="green-black-bg">ち</b>
        の組み合わせです。
        <br />
        つまり「ち」はお題の単語の他の場所にありますが、
        <br />
        4文字目はい段ではないた行の文字です。
      </p>
      <hr />
      <p>難しい場合は次のように適当な単語を入れるのも一つのコツです：</p>
      <Row
        rowState={RowState.LockedIn}
        wordLength={7}
        cluedLetters={[
          { clue: Clue.Almost, letter: "し" },
          { clue: Clue.CorrectConsonant, letter: "ょ" },
          { clue: Clue.Correct, letter: "う" },
          { clue: Clue.CorrectVowelAndElsewhere, letter: "ち" },
          { clue: Clue.Absent, letter: "く" },
          { clue: Clue.CorrectVowel, letter: "ば" },
          { clue: Clue.Elsewhere, letter: "い" },
        ]}
        annotation={"難しい……"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={7}
        cluedLetters={[
          { clue: Clue.Correct, letter: "じ" },
          { clue: Clue.Correct, letter: "ゅ" },
          { clue: Clue.Correct, letter: "う" },
          { clue: Clue.CorrectVowel, letter: "き" },
          { clue: Clue.Absent, letter: "ん" },
          { clue: Clue.Absent, letter: "ぞ" },
          { clue: Clue.CorrectVowel, letter: "く" },
        ]}
        annotation={"適当な推測"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={7}
        cluedLetters={[
          { clue: Clue.Correct, letter: "じ" },
          { clue: Clue.Correct, letter: "ゅ" },
          { clue: Clue.Correct, letter: "う" },
          { clue: Clue.Correct, letter: "い" },
          { clue: Clue.Correct, letter: "ち" },
          { clue: Clue.Correct, letter: "が" },
          { clue: Clue.Correct, letter: "つ" },
        ]}
        annotation={"わかった！"}
      />
      <p>他の例も見てみましょう：</p>
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.CorrectVowel, letter: "さ" },
          { clue: Clue.Absent, letter: "よ" },
          { clue: Clue.Elsewhere, letter: "う" },
          { clue: Clue.Absent, letter: "な" },
          { clue: Clue.Absent, letter: "ら" },
        ]}
        annotation={"ふむふむ"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.CorrectVowel, letter: "な" },
          { clue: Clue.Absent, letter: "ん" },
          { clue: Clue.CorrectVowel, letter: "ち" },
          { clue: Clue.CorrectConsonant, letter: "ゅ" },
          { clue: Clue.Correct, letter: "う" },
        ]}
        annotation={"おっ"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.Correct, letter: "か" },
          { clue: Clue.Correct, letter: "い" },
          { clue: Clue.CorrectVowel, letter: "ぎ" },
          { clue: Clue.Correct, letter: "ょ" },
          { clue: Clue.Correct, letter: "う" },
        ]}
        annotation={"近い！"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.Correct, letter: "か" },
          { clue: Clue.Correct, letter: "い" },
          { clue: Clue.Almost, letter: "し" },
          { clue: Clue.Correct, letter: "ょ" },
          { clue: Clue.Correct, letter: "う" },
        ]}
        annotation={"惜しい！"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.Correct, letter: "か" },
          { clue: Clue.Correct, letter: "い" },
          { clue: Clue.Correct, letter: "じ" },
          { clue: Clue.Correct, letter: "ょ" },
          { clue: Clue.Correct, letter: "う" },
        ]}
        annotation={"やったね！"}
      />
      <p>さらに他の例：</p>
      <Row
        rowState={RowState.LockedIn}
        wordLength={7}
        cluedLetters={[
          { clue: Clue.Absent, letter: "い" },
          { clue: Clue.Elsewhere, letter: "っ" },
          { clue: Clue.Correct, letter: "か" },
          { clue: Clue.CorrectVowelAndElsewhere, letter: "く" },
          { clue: Clue.Almost, letter: "じ" },
          { clue: Clue.CorrectConsonant, letter: "ゅ" },
          { clue: Clue.CorrectVowel, letter: "う" },
        ]}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={7}
        cluedLetters={[
          { clue: Clue.Correct, letter: "せ" },
          { clue: Clue.Correct, letter: "き" },
          { clue: Clue.Correct, letter: "か" },
          { clue: Clue.Correct, letter: "っ" },
          { clue: Clue.Correct, letter: "し" },
          { clue: Clue.Correct, letter: "ょ" },
          { clue: Clue.Correct, letter: "く" },
        ]}
      />
      <p>外来語の例はこちら：</p>
      <Row
        rowState={RowState.LockedIn}
        wordLength={7}
        cluedLetters={[
          { clue: Clue.Absent, letter: "め" },
          { clue: Clue.Elsewhere, letter: "ー" },
          { clue: Clue.CorrectVowel, letter: "る" },
          { clue: Clue.Almost, letter: "ぼ" },
          { clue: Clue.Correct, letter: "っ" },
          { clue: Clue.CorrectConsonant, letter: "く" },
          { clue: Clue.Elsewhere, letter: "す" },
        ]}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={7}
        cluedLetters={[
          { clue: Clue.Correct, letter: "あ" },
          { clue: Clue.Correct, letter: "い" },
          { clue: Clue.Correct, letter: "す" },
          { clue: Clue.Correct, letter: "ほ" },
          { clue: Clue.Correct, letter: "っ" },
          { clue: Clue.Correct, letter: "け" },
          { clue: Clue.Correct, letter: "ー" },
        ]}
      />
      <hr />
      <p>
        <h2>辞書について</h2>
        辞書は、リリィ、CHARM、レギオンの名前が含まれます。聖メルクリウスインターナショナルスクールのレギオンにおける「第n飛空艇団」の部分は省略されています（長いので）。
      </p>
      <hr />
      <p>
        問題やバグが発生した場合は
        <a href="https://github.com/theoria24/new-lilydle/issues">ここ</a>
        から報告するか、misskeyなどのActivityPubサーバーより
        <a href="https://misskey.assaultli.ly/@theoria">@theoria@misskey.assaultli.ly</a>
        にご連絡ください。
      </p>
      <p>
        このゲームはこれからも無料で広告表示もありませんが、
        <br />
        望めば
        <a href="https://ko-fi.com/theoria">私にコーヒーを一杯おごる</a>
        こともできます。
      </p>
    </div>
  );
}
