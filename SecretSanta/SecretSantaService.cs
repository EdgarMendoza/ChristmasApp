using ChristmasApp.Services;

namespace ChristmasApp.SecretSanta;

public class SecretSantaService
{
    private const string ParticipantsKey = "SecretSanta_Participants";
    private const string AssignmentsKey = "SecretSanta_Assignments";
    
    private readonly LocalStorageService _localStorage;

    public SecretSantaService(LocalStorageService localStorage)
    {
        _localStorage = localStorage;
    }

    public async Task<List<Participant>> GetParticipantsAsync()
    {
        var participants = await _localStorage.GetItemAsync<List<Participant>>(ParticipantsKey);
        return participants ?? new List<Participant>();
    }

    public async Task SaveParticipantsAsync(List<Participant> participants)
    {
        await _localStorage.SetItemAsync(ParticipantsKey, participants);
    }

    public async Task<List<Assignment>> GetAssignmentsAsync()
    {
        var assignments = await _localStorage.GetItemAsync<List<Assignment>>(AssignmentsKey);
        return assignments ?? new List<Assignment>();
    }

    public async Task SaveAssignmentsAsync(List<Assignment> assignments)
    {
        await _localStorage.SetItemAsync(AssignmentsKey, assignments);
    }

    public async Task ClearAssignmentsAsync()
    {
        await _localStorage.RemoveItemAsync(AssignmentsKey);
    }

    public async Task ClearAllAsync()
    {
        await _localStorage.RemoveItemAsync(ParticipantsKey);
        await _localStorage.RemoveItemAsync(AssignmentsKey);
    }

    public async Task GenerateAssignmentsAsync()
    {
        var participants = await GetParticipantsAsync();
        if (participants.Count < 2)
            throw new InvalidOperationException("Need at least 2 participants.");

        var random = new Random();
        int maxAttempts = 1000;

        for (int attempt = 0; attempt < maxAttempts; attempt++)
        {
            var receivers = participants.ToList();
            
            int n = receivers.Count;  
            while (n > 1) {  
                n--;  
                int k = random.Next(n + 1);  
                var value = receivers[k];  
                receivers[k] = receivers[n];  
                receivers[n] = value;  
            }

            bool success = true;
            var assignments = new List<Assignment>();

            for (int i = 0; i < participants.Count; i++)
            {
                var giver = participants[i];
                var receiver = receivers[i];

                if (giver.Id == receiver.Id || giver.ExclusionIds.Contains(receiver.Id))
                {
                    success = false;
                    break;
                }

                assignments.Add(new Assignment { GiverId = giver.Id, ReceiverId = receiver.Id });
            }

            if (success)
            {
                await SaveAssignmentsAsync(assignments);
                return;
            }
        }

        throw new InvalidOperationException("Could not generate valid assignments with current exclusions.");
    }
}
