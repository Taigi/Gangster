function one() {


  setTimeout(function () {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)

    process.stdout.write('▄▀▀──▄▀▀▄─')

    setTimeout(function () {
      process.stdout.clearLine()
      process.stdout.cursorTo(0)

      process.stdout.write('▄▀▀──▄▀▀▄─▄▀▀▄─█▀▄──')

      setTimeout(function () {
        process.stdout.clearLine()
        process.stdout.cursorTo(0)

        process.stdout.write('▄▀▀──▄▀▀▄─▄▀▀▄─█▀▄───█▄─▄█─▄▀▀')

        setTimeout(function () {
          process.stdout.clearLine()
          process.stdout.cursorTo(0)

          process.stdout.write('▄▀▀──▄▀▀▄─▄▀▀▄─█▀▄───█▄─▄█─▄▀▀▄─█▀▄─█▄─█')

          setTimeout(function () {
            process.stdout.clearLine()
            process.stdout.cursorTo(0)

            process.stdout.write('▄▀▀──▄▀▀▄─▄▀▀▄─█▀▄───█▄─▄█─▄▀▀▄─█▀▄─█▄─█─█─█▄─█▄▀▀─')
          }, 250);
        }, 250);
      }, 250);
    }, 250);
  }, 250);

}

one()

function two() {

  console.log(' ')

  setTimeout(function () {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)

    process.stdout.write('█─▀█─█──█─█──')

    setTimeout(function () {
      process.stdout.clearLine()
      process.stdout.cursorTo(0)

      process.stdout.write('█─▀█─█──█─█──█─█─█───█')

      setTimeout(function () {
        process.stdout.clearLine()
        process.stdout.cursorTo(0)

        process.stdout.write('█─▀█─█──█─█──█─█─█───█─▀─█─█──')

        setTimeout(function () {
          process.stdout.clearLine()
          process.stdout.cursorTo(0)

          process.stdout.write('█─▀█─█──█─█──█─█─█───█─▀─█─█──█─██▀─█─▀█')

          setTimeout(function () {
            process.stdout.clearLine()
            process.stdout.cursorTo(0)

            process.stdout.write('█─▀█─█──█─█──█─█─█───█─▀─█─█──█─██▀─█─▀█─█─█─▀██─▀█')
          }, 250);
        }, 250);
      }, 250);
    }, 250);
  }, 250);
}

setTimeout(function () {
  two()
}, 1500);

function three() {
  console.log(' ')

  setTimeout(function () {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)

    process.stdout.write('─▀▀───▀▀──')

    setTimeout(function () {
      process.stdout.clearLine()
      process.stdout.cursorTo(0)

      process.stdout.write('─▀▀───▀▀───▀▀──▀▀───')

      setTimeout(function () {
        process.stdout.clearLine()
        process.stdout.cursorTo(0)

        process.stdout.write('─▀▀───▀▀───▀▀──▀▀────▀───▀─')

        setTimeout(function () {
          process.stdout.clearLine()
          process.stdout.cursorTo(0)

          process.stdout.write('─▀▀───▀▀───▀▀──▀▀────▀───▀──▀▀──▀─▀─▀──')

          setTimeout(function () {
            process.stdout.clearLine()
            process.stdout.cursorTo(0)

            process.stdout.write('─▀▀───▀▀───▀▀──▀▀────▀───▀──▀▀──▀─▀─▀──▀─▀─▀──▀─▀▀─')
          }, 250);
        }, 250);
      }, 250);
    }, 250);
  }, 250);
}

setTimeout(function () {
  three()
}, 3000);
