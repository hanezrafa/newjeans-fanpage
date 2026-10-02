' =========================================================
'  NewJeans Fan Board - Launcher (silent)
'  Starts a local static server in the background and opens the
'  page in the default browser. No console window is shown.
' =========================================================
Option Explicit

Dim shell, fso, projectDir, port, url, i, batPath
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

projectDir = "C:\Users\hanez\Downloads\newjeans-fanpage"
port = 8090
url = "http://localhost:" & port & "/"
batPath = projectDir & "\_serve.bat"

' If the server is already up, just open the browser.
If ServerIsUp(url) Then
  shell.Run url, 1, False
  WScript.Quit 0
End If

' Start the server hidden (0 = hidden window, False = do not wait).
shell.Run "cmd.exe /c """ & batPath & """", 0, False

' Wait up to ~20s for the server to answer.
For i = 1 To 40
  WScript.Sleep 500
  If ServerIsUp(url) Then Exit For
Next

' Open the page.
shell.Run url, 1, False

' =========================================================
Function ServerIsUp(u)
  Dim http
  On Error Resume Next
  Set http = CreateObject("MSXML2.ServerXMLHTTP.6.0")
  http.SetTimeouts 400, 400, 400, 600
  http.Open "GET", u, False
  http.Send
  If Err.Number = 0 And http.Status >= 200 And http.Status < 500 Then
    ServerIsUp = True
  Else
    ServerIsUp = False
  End If
  On Error GoTo 0
End Function
