namespace ChristmasApp.SecretSanta;

public class Participant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string GiftNotes { get; set; } = string.Empty;
    public IReadOnlyCollection<Guid> ExclusionIds { get; set; } = new List<Guid>();
}
