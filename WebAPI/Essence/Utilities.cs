namespace Essence;

public static class Utilities {
    public static string ConvertSecondsToTime(int seconds) {
        if (seconds <= 0) return "0:00";

        int hours = seconds / 3600;
        seconds %= 3600;
        int minutes = seconds / 60;
        seconds %= 60;

        return hours > 0 ? $"{hours}:{minutes:00}:{seconds:00}" : $"{minutes}:{seconds:00}";
    }

    public static int ConvertBirthDateToAge(DateTime birthDate) {
        int currDateValue = int.Parse(DateTime.Now.ToString("yyyyMMdd"));
        int birthDateValue = int.Parse(birthDate.ToString("yyyyMMdd"));

        return (currDateValue - birthDateValue) / 10000;
    }

    public static int LevenshteinDistance(string s, string t) {
        int n = s.Length;
        int m = t.Length;
        int[,] d = new int[n + 1, m + 1];

        if (n == 0) {
            return m;
        }

        if (m == 0) {
            return n;
        }

        for (int i = 0; i <= n; d[i, 0] = i++) {}
        for (int j = 0; j <= m; d[0, j] = j++) {}

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                int cost = (t[j - 1] == s[i - 1]) ? 0 : 1;

                d[i, j] = Math.Min(
                    Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                    d[i - 1, j - 1] + cost);
            }
        }

        return d[n, m];
    }
}

