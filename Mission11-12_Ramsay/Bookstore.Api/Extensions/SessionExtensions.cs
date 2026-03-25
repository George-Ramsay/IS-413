using System.Text.Json;

namespace Bookstore.Api.Extensions;

public static class SessionExtensions
{
    // Session only supports primitive values, so these helpers let the cart be stored as JSON.
    public static void SetObject<T>(this ISession session, string key, T value)
    {
        session.SetString(key, JsonSerializer.Serialize(value));
    }

    public static T? GetObject<T>(this ISession session, string key)
    {
        var raw = session.GetString(key);
        return raw is null ? default : JsonSerializer.Deserialize<T>(raw);
    }
}
