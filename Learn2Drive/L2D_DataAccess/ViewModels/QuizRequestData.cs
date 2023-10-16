namespace L2D_DataAccess.ViewModels;
public record QuizRequestData
{
    public int QuestionID { get; set; }
    public int CurrentQuestionID {get; set;}
    public int AnswerId { get; set; }
}