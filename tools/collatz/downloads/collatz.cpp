#include <cstdlib>
#include <fstream>
#include <iostream>
#include <cstdint>
#include <limits>
#include <string>
#include <vector>

#ifdef _WIN32
#include <conio.h>
#include <windows.h>
#endif

class BigInt {
public:
    static const int BASE = 1000000000;
    std::vector<int> d;

    BigInt() : d(1, 0) {}
    BigInt(int v) : d(1, v) {}

    bool parse(const std::string& s) {
        d.assign(1, 0);
        if (s.empty()) return false;
        for (char c : s) {
            if (c < '0' || c > '9') return false;
            mul_small(10);
            add_small(c - '0');
        }
        trim();
        return true;
    }

    bool is_zero() const { return d.size() == 1 && d[0] == 0; }
    bool is_one() const { return d.size() == 1 && d[0] == 1; }
    bool is_odd() const { return d[0] & 1; }

    unsigned long long to_ull() const {
        unsigned long long value = 0;
        for (int i = static_cast<int>(d.size()) - 1; i >= 0; --i) {
            value = value * BASE + static_cast<unsigned long long>(d[i]);
        }
        return value;
    }

    bool operator>(const BigInt& other) const {
        if (d.size() != other.d.size()) return d.size() > other.d.size();
        for (int i = static_cast<int>(d.size()) - 1; i >= 0; --i) {
            if (d[i] != other.d[i]) return d[i] > other.d[i];
        }
        return false;
    }

    void mul_small(int m) {
        long long carry = 0;
        for (size_t i = 0; i < d.size(); ++i) {
            long long cur = 1LL * d[i] * m + carry;
            d[i] = static_cast<int>(cur % BASE);
            carry = cur / BASE;
        }
        while (carry > 0) {
            d.push_back(static_cast<int>(carry % BASE));
            carry /= BASE;
        }
    }

    void add_small(int a) {
        long long carry = a;
        for (size_t i = 0; i < d.size() && carry > 0; ++i) {
            long long cur = d[i] + carry;
            d[i] = static_cast<int>(cur % BASE);
            carry = cur / BASE;
        }
        if (carry > 0) d.push_back(static_cast<int>(carry));
    }

    void div2() {
        long long carry = 0;
        for (int i = static_cast<int>(d.size()) - 1; i >= 0; --i) {
            long long cur = d[i] + carry * BASE;
            d[i] = static_cast<int>(cur / 2);
            carry = cur % 2;
        }
        trim();
    }

    std::string str() const {
        std::string s = std::to_string(d.back());
        for (int i = static_cast<int>(d.size()) - 2; i >= 0; --i) {
            std::string part = std::to_string(d[i]);
            s += std::string(9 - part.size(), '0') + part;
        }
        return s;
    }

private:
    void trim() {
        while (d.size() > 1 && d.back() == 0) d.pop_back();
    }
};

static void pause_before_exit() {
    std::cout << "\nPress any key to close...";
    std::cout.flush();
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
#ifdef _WIN32
    _getch();
#else
    std::system("stty raw -echo");
    std::cin.get();
    std::system("stty sane");
#endif
    std::cout << "\n";
}

static std::string desktop_path(const std::string& filename) {
#ifdef _WIN32
    const char* profile = std::getenv("USERPROFILE");
    return profile ? std::string(profile) + "\\Desktop\\" + filename : filename;
#else
    const char* home = std::getenv("HOME");
    return home ? std::string(home) + "/Desktop/" + filename : filename;
#endif
}

static bool read_value(const std::string& text, BigInt& value, bool& repeat_mode) {
    repeat_mode = false;
    if (text == "-1") {
        repeat_mode = true;
        return true;
    }
    return value.parse(text) && !value.is_zero();
}

static void calculate(BigInt n) {
    BigInt start = n;
    BigInt highest = n;
    unsigned long long steps = 0;

    std::cout << n.str();
    while (!n.is_one()) {
        if (n.is_odd()) {
            n.mul_small(3);
            n.add_small(1);
        } else {
            n.div2();
        }
        if (n > highest) highest = n;
        ++steps;
        std::cout << "->" << n.str();
    }

    std::cout << "\nSteps: " << steps << "\n";
    std::cout << "Highest value: " << highest.str() << "\n";

    unsigned long long start_ull = start.to_ull();
    unsigned long long highest_ull = highest.to_ull();
    if (start_ull != 0 && highest_ull % start_ull == 0) {
        std::cout << start.str() << "*" << (highest_ull / start_ull)
                  << " = " << highest.str() << "\n";
    } else if (start_ull != 0) {
        double multiplier = static_cast<double>(highest_ull) / static_cast<double>(start_ull);
        std::cout << start.str() << "*n = " << highest.str()
                  << " where n is about " << multiplier << "\n";
    }
}

static void calculate_summary_to_stream(BigInt n, std::ostream& out) {
    BigInt start = n;
    unsigned long long steps = 0;

    if (n.is_one()) {
        out << start.str() << ": next 1, total 0 steps\n";
        return;
    }

    if (n.is_odd()) {
        n.mul_small(3);
        n.add_small(1);
    } else {
        n.div2();
    }
    BigInt next = n;
    ++steps;

    while (!n.is_one()) {
        if (n.is_odd()) {
            n.mul_small(3);
            n.add_small(1);
        } else {
            n.div2();
        }
        ++steps;
    }

    out << start.str() << ": next " << next.str() << ", total " << steps << " steps\n";
}

static unsigned int lifespan_fast(std::uint64_t n, const std::vector<unsigned int>& cache) {
    std::uint64_t x = n;
    unsigned int steps = 0;

    while (x != 1) {
        if (x < cache.size() && cache[x] != 0) return steps + cache[x];

        if (x & 1) {
            if (x > (UINT64_MAX - 1) / 3) return 0;
            x = x * 3 + 1;
        } else {
            x >>= 1;
        }
        ++steps;
    }

    return steps;
}

static void run_forever() {
    const std::string path = desktop_path("collatz.txt");
    std::ofstream out(path, std::ios::app);
    if (!out) {
        std::cout << "Could not open " << path << " for writing.\n";
        return;
    }

    BigInt n(1);
    unsigned long long count = 0;

    std::cout << "Writing Collatz summaries from 1 upward to:\n";
    std::cout << path << "\n";
    std::cout << "Progress is saved every 100 numbers.\n";
    std::cout << "Press Ctrl+C to stop.\n\n";

    while (true) {
        calculate_summary_to_stream(n, out);
        n.add_small(1);
        ++count;

        if (count % 100 == 0) {
            out.flush();
            std::cout << "Saved through n = " << count << "\n";
        }
    }
}

static void search_lifespan_records() {
    const std::string path = desktop_path("collatz_lifespan.txt");
    std::ofstream out(path, std::ios::app);
    if (!out) {
        std::cout << "Could not open " << path << " for writing.\n";
        return;
    }

    const std::size_t cache_size = 10000000;
    std::vector<unsigned int> cache(cache_size, 0);
    cache[1] = 0;

    std::uint64_t n = 1;
    unsigned int best_steps = 0;

    std::cout << "Searching for new largest lifespans from 1 upward.\n";
    std::cout << "Only new records are saved to:\n";
    std::cout << path << "\n";
    std::cout << "Press Ctrl+C to stop.\n\n";

    while (true) {
        unsigned int steps = lifespan_fast(n, cache);
        if (steps == 0 && n != 1) {
            std::cout << "Stopped: number became too large for fast 64-bit search.\n";
            return;
        }

        if (n < cache.size()) cache[n] = steps;

        if (steps > best_steps || n == 1) {
            best_steps = steps;
            out << "cur largest lifespan " << best_steps << ", num " << n << "\n";
            out.flush();
            std::cout << "cur largest lifespan " << best_steps << ", num " << n << "\n";
        }

        ++n;
        if (n % 1000000 == 0) {
            std::cout << "checked through n = " << n << "\n";
        }
    }
}

int main(int argc, char** argv) {
#ifdef _WIN32
    SetConsoleOutputCP(CP_UTF8);
    SetConsoleCP(CP_UTF8);
#endif

    std::cout << "3n+1 / Collatz calculator\n";
    std::cout << "Enter -1 for repeat mode.\n";
    std::cout << "Enter 0 to write summaries to collatz.txt.\n";
    std::cout << "Enter -3 to search only new largest lifespans.\n\n";

    std::string text;
    if (argc > 1) {
        text = argv[1];
    } else {
        std::cout << "Enter a positive integer: ";
        std::cin >> text;
    }

    BigInt value;
    bool repeat_mode = false;
    if (text == "0") {
        run_forever();
        return 0;
    }
    if (text == "-3") {
        search_lifespan_records();
        return 0;
    }

    if (!read_value(text, value, repeat_mode)) {
        std::cout << "Input must be a positive integer.\n";
        pause_before_exit();
        return 1;
    }

    if (repeat_mode) {
        while (true) {
            std::cout << "\nEnter a positive integer, or 0 to stop: ";
            std::cin >> text;
            if (text == "0") break;
            if (!value.parse(text) || value.is_zero()) {
                std::cout << "Input must be a positive integer.\n";
                continue;
            }
            calculate(value);
        }
    } else {
        calculate(value);
    }

    pause_before_exit();
    return 0;
}
