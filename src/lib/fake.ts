/**
 * Made-up contact details, turned away at the form so the visitor can fix them at once. The control plane checks again and
 * decides: a demo's login is emailed only, so the address has to be real.
 */

const PLACEHOLDER_DOMAINS = new Set([
  "company.com", "yourcompany.com", "mycompany.com", "companyname.com", "domain.com", "yourdomain.com", "email.com", "test.com", "testing.com",
  "example.com", "example.org", "example.net", "sample.com", "demo.com", "fake.com", "abc.com", "xyz.com", "asdf.com", "qwerty.com",
  "noemail.com", "nomail.com", "none.com", "na.com", "no.com", "null.com", "temp.com", "tmp.com", "gmail.con", "gmial.com", "gamil.com", "yaho.com", "hotmial.com",
]);

const THROWAWAY_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "10minutemail.com", "tempmail.com", "temp-mail.org", "yopmail.com",
  "trashmail.com", "getnada.com", "dispostable.com", "maildrop.cc", "fakeinbox.com", "throwawaymail.com", "mailnesia.com", "emailondeck.com", "mohmal.com", "moakt.com",
]);

const PLACEHOLDER_NAMES = new Set([
  "test", "testing", "tester", "demo", "asdf", "qwerty", "abc", "abcd", "xyz", "joe", "john", "john.doe", "jane.doe", "johndoe", "janedoe", "name", "user",
  "username", "email", "mail", "fake", "sample", "noreply", "no-reply", "none", "na", "nobody", "someone", "me", "you", "yourname", "firstname.lastname",
]);

/** Why an address cannot be a real person's, or "" when it may be. */
export function fakeEmail(address: string): string {
  const a = address.trim().toLowerCase();
  const at = a.lastIndexOf("@");
  if (at < 1) return "";
  const local = a.slice(0, at);
  const domain = a.slice(at + 1);
  if (PLACEHOLDER_DOMAINS.has(domain) || PLACEHOLDER_NAMES.has(local) || (local.length >= 4 && new Set(local).size === 1) || /\.(test|example|invalid|localhost|local|internal)$/.test(domain)) {
    return "Use your own work email. We send your demo login there";
  }
  if (THROWAWAY_DOMAINS.has(domain)) return "Disposable email addresses cannot be used. Use your own work email";
  return "";
}

/** True for the numbers people type to get past the field: one digit repeated, two alternating, or a run like 1234567890 or 9876543210. */
export function fakePhone(phone: string): boolean {
  let digits = phone.replace(/\D/g, "");
  if (digits.length > 10) digits = digits.slice(-10); // a country code must not hide a pattern
  if (digits.length < 7) return false;
  if (new Set(digits).size <= 2) return true;
  let run = 1;
  let best = 1;
  let dir = 0;
  for (let i = 1; i < digits.length; i++) {
    const step = (Number(digits[i]) - Number(digits[i - 1]) + 10) % 10;
    if (step === 1 && dir >= 0) {
      run++;
      dir = 1;
    } else if (step === 9 && dir <= 0) {
      run++;
      dir = -1;
    } else {
      run = step === 1 || step === 9 ? 2 : 1;
      dir = step === 1 ? 1 : step === 9 ? -1 : 0;
    }
    best = Math.max(best, run);
  }
  return best >= 7;
}
