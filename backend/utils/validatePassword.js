export default function validatePassword(password) {
  const regex = new RegExp(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
  );
  console.log("Password", password);

  return regex.test(password);
}
