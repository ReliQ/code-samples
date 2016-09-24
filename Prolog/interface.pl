%%  Vrijeme
%%  interface.pl
%%  UI counterpart. Essential to Web UI.
%%  The 
%-  Author: Patrick Reid (@IAmReliQ)


:- ensure_loaded([main]).

% Redefine memory file to facilitate remote execution.
memory_file('core/.memory.vrij').


sysInfo:-
    system(X),
    write(X).


% Get memory filename.
memFile:-
    memory_file(X),
    write(X).


% List current readings.
current:-
    loadReadings(X),
    revl(X,Y),
    write(Y).


% Get readable prediction.
predict:-
    loadReadings(X),
    length(X, Len),
    ( Len >= 3 -> prediction; write('Not available.')).


% Save reading interface.
iSaveReading(R):- 
    memory_file(X),
    open(X, append, Stream),             
    write(Stream, R), write(Stream,'.'),     
    nl(Stream), close(Stream), write('Filed.').