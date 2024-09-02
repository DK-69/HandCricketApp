#include <iostream>
#include <fstream>
#include <unistd.h>
#include <sys/wait.h>
#include <signal.h>

int main() {
    pid_t pid = getpid();

    if (pid < 0) {
        std::cerr << "Fork failed!" << std::endl;
        return 1;
    }

    while (true) {
        std::cout << "Dk_19 " << pid << std::endl;
        sleep(1);
    }

    return 0;
}
