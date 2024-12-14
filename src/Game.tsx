import { useEffect, useRef, useState } from "react";
import { Row, RowState } from "./Row";
import { Clue, clue, describeClue, violation } from "./clue";
import { Keyboard } from "./Keyboard";
import targetList from "./assaultlily.json";
import {
  dictionarySet,
  Difficulty,
  isKogaki,
  isVoiced,
  pick,
  resetRng,
  seed,
  speak,
  toHiraganaKeepLongVowelMark,
  toKogaki,
  toSeion,
  urlParam,
} from "./util";
import { decode, encode } from "./base64";
import { toRomaji } from "wanakana";
import { cheer } from "./cheer";

enum GameState {
  Playing,
  Won,
  Lost,
}

interface GameProps {
  maxGuesses: number;
  hidden: boolean;
  difficulty: Difficulty;
  colorBlind: boolean;
  keyboardLayout: string;
}

const targets = targetList;
const minLength = 2;
const maxLength = 13;

function randomTarget(wordLength: number): string {
  const eligible = targets.filter((word) => word.length === wordLength);
  let candidate: string;
  do {
    candidate = pick(eligible);
  } while (/\*/.test(candidate));
  return candidate;
}

function getChallengeUrl(target: string): string {
  return (
    window.location.origin +
    window.location.pathname +
    "?challenge=" +
    encode(toRomaji(target))
  );
}

let initChallenge = "";
let challengeError = false;
try {
  initChallenge = toHiraganaKeepLongVowelMark(
    decode(urlParam("challenge") ?? "")
  );
} catch (e) {
  console.warn(e);
  challengeError = true;
}
if (initChallenge && !dictionarySet.has(initChallenge)) {
  initChallenge = "";
  challengeError = true;
}

function parseUrlLength(): number {
  const lengthParam = urlParam("length");
  if (!lengthParam) return 6;
  const length = Number(lengthParam);
  return length >= minLength && length <= maxLength ? length : 6;
}

function parseUrlGameNumber(): number {
  const gameParam = urlParam("game");
  if (!gameParam) return 1;
  const gameNumber = Number(gameParam);
  return gameNumber >= 1 && gameNumber <= 1000 ? gameNumber : 1;
}

function Game(props: GameProps) {
  const [gameState, setGameState] = useState(GameState.Playing);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [hint, setHint] = useState<string>(
    challengeError
      ? `招待リンクが無効です。ランダムモードをプレイします。`
      : `あなたの推測を入力してください！`
  );
  const [challenge, setChallenge] = useState<string>(initChallenge);
  const [wordLength, setWordLength] = useState(
    challenge ? challenge.length : parseUrlLength()
  );
  const [gameNumber, setGameNumber] = useState(parseUrlGameNumber());
  const [target, setTarget] = useState(() => {
    resetRng();
    // Skip RNG ahead to the parsed initial game number:
    for (let i = 1; i < gameNumber; i++) randomTarget(wordLength);
    return challenge || randomTarget(wordLength);
  });
  const [candidates, setCandidates] = useState(Array.from(dictionarySet));
  const [shift, setShift] = useState<boolean>(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const startNextGame = () => {
    if (challenge) {
      // Clear the URL parameters:
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setChallenge("");
    const newWordLength =
      wordLength >= minLength && wordLength <= maxLength ? wordLength : 6;
    setWordLength(newWordLength);
    setTarget(randomTarget(newWordLength));
    setHint("");
    setGuesses([]);
    setCurrentGuess("");
    setGameState(GameState.Playing);
    setGameNumber((x) => x + 1);
    setCandidates(
      Array.from(dictionarySet).filter((word) => word.length === newWordLength)
    );
  };

  async function share(
    url: string,
    copiedHint: string,
    firstText?: string,
    secondText?: string
  ) {
    const body =
      (firstText ? firstText + "\n" : "") +
      url +
      (secondText ? "\n\n" + secondText : "");
    if (
      /android|iphone|ipad|ipod|webos/i.test(navigator.userAgent) &&
      !/firefox/i.test(navigator.userAgent)
    ) {
      try {
        await navigator.share({ text: body });
        return;
      } catch (e) {
        console.warn("navigator.share failed:", e);
      }
    }
    try {
      await navigator.clipboard.writeText(body);
      setHint(copiedHint);
      return;
    } catch (e) {
      console.warn("navigator.clipboard.writeText failed:", e);
    }
    setHint(url);
  }

  const onKey = (key: string) => {
    if (gameState !== GameState.Playing) {
      if (key === "確定" || key === "Enter") {
        startNextGame();
      }
      return;
    }
    if (guesses.length === props.maxGuesses) return;
    if (key === "大/小") {
      key = toKogaki(key);
    }
    if (/^[a-zぁ-ん]$/i.test(key)) {
      setCurrentGuess((guess) => {
        const newGuess = guess + key.toLowerCase();
        return (
          !/n$/i.test(guess) && key.toLowerCase() === "n"
            ? newGuess
            : toHiraganaKeepLongVowelMark(newGuess.replace("nn", "n"))
        ).slice(0, wordLength);
      });
      tableRef.current?.focus();
      setHint("");
      if (shift) setShift(false);
    } else if (key === "゛") {
      const letter = currentGuess.slice(-1);
      const mark = "\u{3099}";
      const key = isVoiced(letter)
        ? toSeion(letter)
        : (toSeion(letter) + mark).normalize().replace(mark, "");
      setCurrentGuess((guess) =>
        (guess.slice(0, -1) + key).slice(0, wordLength)
      );
      if (shift) setShift(false);
    } else if (key === "゜") {
      const letter = currentGuess.slice(-1);
      const mark = "\u{309A}";
      const key = isVoiced(letter)
        ? toSeion(letter)
        : (toSeion(letter) + mark).normalize().replace(mark, "");
      setCurrentGuess((guess) =>
        (guess.slice(0, -1) + key).slice(0, wordLength)
      );
      if (shift) setShift(false);
    } else if (key === "大/小") {
      const letter = currentGuess.slice(-1);
      const key = isKogaki(letter) ? toSeion(letter) : toKogaki(letter);
      setCurrentGuess((guess) =>
        (guess.slice(0, -1) + key).slice(0, wordLength)
      );
      setHint("");
    } else if (key === "長音" || key === "-" || key === "ー") {
      setCurrentGuess((guess) => (guess + "ー").slice(0, wordLength));
      setHint("");
      if (shift) setShift(false);
    } else if (key === "Backspace") {
      setCurrentGuess((guess) => guess.slice(0, -1));
      setHint("");
    } else if (key === "Shift" || key === "☆") {
      setShift(!shift);
    } else if (key === "確定" || key === "Enter") {
      if (currentGuess.length !== wordLength) {
        setHint("短すぎます");
        return;
      }
      if (!dictionarySet.has(currentGuess)) {
        if (/^(.)\1+$/g.test(currentGuess)) {
          if (guesses.length === 0)
            setHint(
              "お疲れですか？こんなゲームなんかやめて、散歩でもしましょう"
            );
          else {
            setHint(cheer(candidates, guesses, target, setCandidates));
          }
        } else {
          setHint("有効な単語ではありません");
        }
        return;
      }
      for (const g of guesses) {
        const c = clue(g, target);
        const feedback = violation(props.difficulty, c, currentGuess);
        if (feedback) {
          setHint(feedback);
          return;
        }
      }
      setGuesses((guesses) => guesses.concat([currentGuess]));
      setCurrentGuess((guess) => "");

      const gameOver = (verbed: string) =>
        `あなたの${verbed}！正解は「${target.toUpperCase()}」です。（確定で${
          challenge ? "ランダムモードで遊ぶ" : "再び遊ぶ"
        })`;

      if (currentGuess === target) {
        setHint(gameOver("勝ち"));
        setGameState(GameState.Won);
      } else if (guesses.length + 1 === props.maxGuesses) {
        setHint(gameOver("負け"));
        setGameState(GameState.Lost);
      } else {
        setHint("");
        speak(describeClue(clue(currentGuess, target)));
      }
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        onKey(e.key);
      }
      if (e.key === "Backspace") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentGuess, gameState]);

  let letterInfo = new Map<string, Clue>();
  const tableRows = Array(props.maxGuesses)
    .fill(undefined)
    .map((_, i) => {
      const guess = [...guesses, currentGuess][i] ?? "";
      const cluedLetters = clue(guess, target);
      const lockedIn = i < guesses.length;
      if (lockedIn) {
        for (const { clue, letter } of cluedLetters) {
          if (clue === undefined) break;
          const old = letterInfo.get(letter);
          if (old === undefined || clue > old) {
            letterInfo.set(letter, clue);
            if (!(letter in ["っ", "ー"])) {
              const romaji = toRomaji(letter);
              const consonants = romaji.slice(0, -1);
              const vowel = romaji.slice(-1);
              const oldCheckAndSet = (letter: string, clue: Clue) => {
                const old = letterInfo.get(letter);
                if (old === undefined || clue > old)
                  letterInfo.set(letter, clue);
              };
              if (clue === Clue.Correct) {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, clue);
                oldCheckAndSet(vowel, clue);
              } else if (clue === Clue.Almost) {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, Clue.Absent);
                oldCheckAndSet(vowel, Clue.Correct);
              } else if (clue === Clue.CorrectConsonantAndElsewhere) {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, Clue.Correct);
                oldCheckAndSet(vowel, Clue.Elsewhere);
              } else if (clue === Clue.CorrectVowelAndElsewhere) {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, Clue.Elsewhere);
                oldCheckAndSet(vowel, Clue.Correct);
              } else if (clue === Clue.CorrectConsonant) {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, Clue.Correct);
                oldCheckAndSet(vowel, Clue.Absent);
              } else if (clue === Clue.CorrectVowel) {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, Clue.Absent);
                oldCheckAndSet(vowel, Clue.Correct);
              } else {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, clue);
                oldCheckAndSet(vowel, clue);
              }
            }
          }
        }
      }
      return (
        <Row
          key={i}
          wordLength={wordLength}
          rowState={
            lockedIn
              ? RowState.LockedIn
              : i === guesses.length
              ? RowState.Editing
              : RowState.Pending
          }
          cluedLetters={cluedLetters}
        />
      );
    });

  return (
    <div className="Game" style={{ display: props.hidden ? "none" : "block" }}>
      <div className="Game-options">
        <label htmlFor="wordLength">単語の文字数：</label>
        <input
          type="range"
          min={minLength}
          max={maxLength}
          id="wordLength"
          disabled={
            gameState === GameState.Playing &&
            (guesses.length > 0 || currentGuess !== "" || challenge !== "")
          }
          value={wordLength}
          onChange={(e) => {
            const length = Number(e.target.value);
            resetRng();
            setGameNumber(1);
            setGameState(GameState.Playing);
            setGuesses([]);
            setCurrentGuess("");
            setTarget(randomTarget(length));
            setWordLength(length);
            setCandidates(
              Array.from(dictionarySet).filter((word) => word.length === length)
            );
            setHint(`${length} 文字`);
          }}
        ></input>
        <button
          style={{ flex: "0 0 auto" }}
          disabled={gameState !== GameState.Playing || guesses.length === 0}
          onClick={() => {
            setHint(
              `答えは「${target.toUpperCase()}」でした。（確定で再挑戦）`
            );
            setGameState(GameState.Lost);
            (document.activeElement as HTMLElement)?.blur();
          }}
        >
          諦める
        </button>
      </div>
      <table
        className="Game-rows"
        tabIndex={0}
        aria-label="Table of guesses"
        ref={tableRef}
      >
        <tbody>{tableRows}</tbody>
      </table>
      <p
        role="alert"
        style={{
          userSelect: /https?:/.test(hint) ? "text" : "none",
          whiteSpace: "pre-wrap",
        }}
      >
        {hint || `\u00a0`}
      </p>
      <Keyboard
        layout={props.keyboardLayout}
        letterInfo={letterInfo}
        guesses={guesses
          .map((g) => clue(g, target))
          .map((c) => {
            const length = currentGuess.replace(/\w/g, "").length;
            return c[length <= maxLength ? length : length - 1];
          })}
        onKey={onKey}
        shift={props.keyboardLayout.split("|").length === 2 && shift}
      />
      {gameState !== GameState.Playing && (
        <p>
          <button
            onClick={() => {
              const emoji = props.colorBlind
                ? ["⬛", "🟦", "🟧"]
                : ["⬛", "🟨", "🟩"];
              share(
                getChallengeUrl(target),
                "共有リンクをクリップボードにコピーしました！"
              );
            }}
          >
            この単語を友達にチャレンジさせる
          </button>{" "}
          <button
            onClick={() => {
              share(
                getChallengeUrl(target),
                "結果をクリップボードにコピーしました！",
                `アサルトリリィわーどる(${
                seed ? seed : "random"
                })`,
                guesses
                  .map((guess) =>
                    clue(guess, target)
                      .map(
                        (c) =>
                          ["⬛", "🟡", "🟥", "🟦", "🔴", "🔵", "🟪", "🟩"][
                            c.clue ?? 0
                          ]
                      )
                      .join("")
                  )
                  .join("\n")
              );
            }}
          >
            絵文字で結果をシェアする
          </button>
        </p>
      )}
      {challenge ? (
        <div className="Game-seed-info">playing a challenge game</div>
      ) : seed ? (
        <div className="Game-seed-info">
          シード値：{seed}，単語の長さ：{wordLength}，ゲーム番号：{gameNumber}
        </div>
      ) : undefined}
    </div>
  );
}

export default Game;
