import { toHiragana } from "wanakana";
import dictionary from "./assaultlily.json";

export enum Difficulty {
  Normal,
  Hard,
  UltraHard,
}

export const maxGuesses = 6;

export const toHiraganaKeepLongVowelMark = (input: string) =>
  toHiragana(input.replaceAll("ー", "_")).replaceAll("_", "ー");

export const dictionarySet: Set<string> = new Set(dictionary);

function mulberry32(a: number) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function urlParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

export const seed = Number(urlParam("seed"));
const makeRandom = () => (seed ? mulberry32(seed) : () => Math.random());
let random = makeRandom();

export function resetRng(): void {
  random = makeRandom();
}

export function pick<T>(array: Array<T>): T {
  return array[Math.floor(array.length * random())];
}

// https://a11y-guidelines.orange.com/en/web/components-examples/make-a-screen-reader-talk/
export function speak(
  text: string,
  priority: "polite" | "assertive" = "assertive"
) {
  var el = document.createElement("div");
  var id = "speak-" + Date.now();
  el.setAttribute("id", id);
  el.setAttribute("aria-live", priority || "polite");
  el.classList.add("sr-only");
  document.body.appendChild(el);

  window.setTimeout(function () {
    document.getElementById(id)!.innerHTML = text;
  }, 100);

  window.setTimeout(function () {
    document.body.removeChild(document.getElementById(id)!);
  }, 1000);
}

export function toSeion(letter: string): string {
  for (let [key, value] of Object.entries({
    ぁ: "あ",
    ぃ: "い",
    ぅ: "う",
    ぇ: "え",
    ぉ: "お",
    がゕ: "か",
    ぎ: "き",
    ぐ: "く",
    げゖ: "け",
    ご: "こ",
    ざ: "さ",
    じ: "し",
    ず: "す",
    ぜ: "せ",
    ぞ: "そ",
    だ: "た",
    ぢ: "ち",
    づっ: "つ",
    で: "て",
    ど: "と",
    ばぱ: "は",
    びぴ: "ひ",
    ぶぷ: "ふ",
    べぺ: "へ",
    ぼぽ: "ほ",
    ゃ: "や",
    ゅ: "ゆ",
    ょ: "よ",
    ゎ: "わ",
  }))
    if (key.includes(letter)) return value;
  return letter;
}

export function toConsonant(letter: string): string {
  for (let [key, value] of Object.entries({
    あいうえおぁぃぅぇぉ: "あ",
    かきくけこゕゖ: "か",
    さしすせそ: "さ",
    たちつてとっ: "た",
    なにぬねの: "な",
    はひふへほ: "は",
    まみむめも: "ま",
    やゆよゃゅょ: "や",
    らりるれろ: "ら",
    わゐゑを: "わ",
    がぎぐげご: "が",
    ざじずぜぞ: "ざ",
    だぢづでど: "だ",
    ばびぶべぼ: "ば",
    ぱぴぷぺぽ: "ぱ",
  }))
    if (key.includes(letter)) return value;
  return letter;
}

export function toVowel(letter: string): string {
  const seionLetter = toSeion(letter);
  for (let [key, value] of Object.entries({
    あかさたなはまやらわ: "あ",
    いきしちにひみりゐ: "い",
    うくすつぬふむゆる: "う",
    えけせてねへめれゑ: "え",
    おこそとのほもよろを: "お",
  }))
    if (key.includes(seionLetter)) return value;
  return letter;
}

export function isVoiced(letter: string): boolean {
  return "がぎぐげござじずぜぞだぢづでどばびぶべぼ".includes(letter);
}

export function toVoiced(letter: string): string {
  switch (letter) {
    case "か":
      return "が";
    case "き":
      return "ぎ";
    case "く":
      return "ぐ";
    case "け":
      return "げ";
    case "こ":
      return "ご";
    case "さ":
      return "ざ";
    case "し":
      return "じ";
    case "す":
      return "ず";
    case "せ":
      return "ぜ";
    case "そ":
      return "ぞ";
    case "た":
      return "だ";
    case "ち":
      return "ぢ";
    case "つ":
      return "づ";
    case "て":
      return "で";
    case "と":
      return "ど";
    case "は":
      return "ば";
    case "ひ":
      return "び";
    case "ふ":
      return "ぶ";
    case "へ":
      return "べ";
    case "ほ":
      return "ぼ";
    default:
      return letter;
  }
}

export function isSemivoiced(letter: string): boolean {
  return "ぱぴぷぺぽ".includes(letter);
}

export function toSemivoiced(letter: string): string {
  switch (letter) {
    case "は":
      return "ぱ";
    case "ひ":
      return "ぴ";
    case "ふ":
      return "ぷ";
    case "へ":
      return "ぺ";
    case "ほ":
      return "ぽ";
    default:
      return letter;
  }
}

export function isKogaki(letter: string): boolean {
  return "ぁぃぅぇぉっゃゅょゎゕゖ".includes(letter);
}

export function toKogaki(letter: string): string {
  switch (letter) {
    case "あ":
      return "ぁ";
    case "い":
      return "ぃ";
    case "う":
      return "ぅ";
    case "え":
      return "ぇ";
    case "お":
      return "ぉ";
    case "つ":
      return "っ";
    case "や":
      return "ゃ";
    case "ゆ":
      return "ゅ";
    case "よ":
      return "ょ";
    case "わ":
      return "ゎ";
    case "か":
      return "ゕ";
    case "け":
      return "ゖ";
    default:
      return letter;
  }
}

export function describeSeed(seed: number): string {
  const year = Math.floor(seed / 10000);
  const month = Math.floor(seed / 100) % 100;
  const day = seed % 100;
  const isLeap = year % (year % 25 ? 4 : 16) === 0;
  const feb = isLeap ? 29 : 28;
  const days = [0, 31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (
    year >= 2000 &&
    year <= 2100 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= days[month]
  ) {
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } else {
    return "seed " + seed;
  }
}
